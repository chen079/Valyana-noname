const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');
const scanDirs = [
    path.join(root, 'packs', 'skills'),
    path.join(root, 'packs', 'vuffs'),
    path.join(root, 'packs', 'cards'),
];

const knownGlobals = new Set([
    'Array', 'Boolean', 'Date', 'Error', 'Infinity', 'JSON', 'Math', 'NaN', 'Number', 'Object',
    'Promise', 'RegExp', 'Set', 'String', 'Symbol', 'Map', 'WeakMap', 'WeakSet', 'console',
    'undefined', 'true', 'false', 'null',
    'lib', 'game', 'ui', 'get', 'ai', '_status',
    'event', 'trigger', 'player',
]);

const suspiciousNames = new Set(['result', 'cardResult', 'giveResult', 'targetResult', 'chooseResult']);

function walk(dir, files = []) {
    if (!fs.existsSync(dir)) return files;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.name === 'archived') continue;
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full, files);
        else if (entry.isFile() && entry.name.endsWith('.js')) files.push(full);
    }
    return files;
}

function maskSource(source) {
    let out = '';
    let mode = 'code';
    let quote = '';
    for (let i = 0; i < source.length; i++) {
        const ch = source[i];
        const next = source[i + 1];
        if (mode === 'line') {
            if (ch === '\n') {
                mode = 'code';
                out += ch;
            } else out += ' ';
            continue;
        }
        if (mode === 'block') {
            if (ch === '*' && next === '/') {
                out += '  ';
                i++;
                mode = 'code';
            } else out += ch === '\n' ? ch : ' ';
            continue;
        }
        if (mode === 'string') {
            if (ch === '\\') {
                out += ' ';
                if (next) {
                    out += next === '\n' ? '\n' : ' ';
                    i++;
                }
            } else if (ch === quote) {
                out += ' ';
                mode = 'code';
            } else out += ch === '\n' ? '\n' : ' ';
            continue;
        }
        if (ch === '/' && next === '/') {
            out += '  ';
            i++;
            mode = 'line';
        } else if (ch === '/' && next === '*') {
            out += '  ';
            i++;
            mode = 'block';
        } else if (ch === '"' || ch === '\'' || ch === '`') {
            quote = ch;
            out += ' ';
            mode = 'string';
        } else out += ch;
    }
    return out;
}

function getDepthBeforeLines(masked) {
    const lines = masked.split(/\r?\n/);
    const depths = [];
    let depth = 0;
    for (const line of lines) {
        depths.push(depth);
        for (const ch of line) {
            if (ch === '{') depth++;
            else if (ch === '}') depth = Math.max(0, depth - 1);
        }
    }
    return { lines, depths };
}

function declarationNames(line) {
    const names = [];
    const reg = /\b(?:let|const)\s+([^;{}]+)/g;
    let match;
    while ((match = reg.exec(line))) {
        for (const part of match[1].split(',')) {
            const name = part.trim().match(/^([A-Za-z_$][\w$]*)\b/);
            if (name) names.push(name[1]);
        }
    }
    return names;
}

function declaredParams(line) {
    const names = [];
    const functionMatches = line.matchAll(/\bfunction\s*\(([^)]*)\)/g);
    for (const match of functionMatches) {
        names.push(...match[1].split(',').map(item => item.trim()).filter(Boolean));
    }
    const methodMatch = line.match(/^\s*[A-Za-z_$][\w$]*\s*\(([^)]*)\)\s*\{/);
    if (methodMatch) {
        names.push(...methodMatch[1].split(',').map(item => item.trim()).filter(Boolean));
    }
    const arrowMatch = line.match(/(?:^|[=(,]\s*)([A-Za-z_$][\w$]*)\s*=>/);
    if (arrowMatch) names.push(arrowMatch[1]);
    const arrowParenMatch = line.match(/\(([^)]*)\)\s*=>/);
    if (arrowParenMatch) {
        names.push(...arrowParenMatch[1].split(',').map(item => item.trim()).filter(Boolean));
    }
    return names;
}

function propertyAt(line, index) {
    let i = index - 1;
    while (i >= 0 && /\s/.test(line[i])) i--;
    return line[i] === '.';
}

function propertyKeyAt(line, index, name) {
    const rest = line.slice(index + name.length);
    return /^\s*:/.test(rest);
}

function keywordAt(line, index, word) {
    const before = line.slice(Math.max(0, index - 12), index);
    return new RegExp(`\\b${word}\\s*$`).test(before);
}

function checkBlockScopedUses(file, lines, depths) {
    const diagnostics = [];
    const declarations = [];
    const allDeclarations = [];
    const uses = [];
    const blockStarts = [];

    lines.forEach((line, index) => {
        const lineNo = index + 1;
        if (/\b(if|else|for|while|switch)\b.*\{\s*$/.test(line)) {
            blockStarts.push({ line: lineNo, depth: depths[index] + 1 });
        }
        for (const name of declarationNames(line)) {
            allDeclarations.push({ name, line: lineNo, depth: depths[index] });
            if (suspiciousNames.has(name)) {
                const inControlBlock = blockStarts.some(block => block.depth === depths[index] && block.line <= lineNo);
                if (inControlBlock) declarations.push({ name, line: lineNo, depth: depths[index] });
            }
        }
        const reg = /\b[A-Za-z_$][\w$]*\b/g;
        let match;
        while ((match = reg.exec(line))) {
            const name = match[0];
            if (!suspiciousNames.has(name)) continue;
            if (propertyAt(line, match.index)) continue;
            if (propertyKeyAt(line, match.index, name)) continue;
            if (keywordAt(line, match.index, 'let') || keywordAt(line, match.index, 'const')) continue;
            uses.push({ name, line: lineNo, depth: depths[index] });
        }
    });

    for (const decl of declarations) {
        if (decl.depth <= 0) continue;
        for (const use of uses) {
            if (use.name !== decl.name || use.line <= decl.line || use.depth >= decl.depth) continue;
            const outerDecl = allDeclarations.some(item =>
                item.name === decl.name && item.line <= use.line && item.depth <= use.depth
            );
            if (!outerDecl) {
                diagnostics.push({
                    file,
                    line: use.line,
                    message: `'${decl.name}' declared with let/const at line ${decl.line} may be used outside its block`,
                });
                break;
            }
        }
    }
    return diagnostics;
}

function checkHookCallbackParams(file, lines) {
    const diagnostics = [];
    const hookReg = /\b(ai|check|filter|filterCard|filterTarget|ai1|ai2)\s*:\s*function\s*\(([^)]*)\)\s*\{/;

    for (let i = 0; i < lines.length; i++) {
        const match = lines[i].match(hookReg);
        if (!match) continue;

        const hookName = match[1];
        const params = new Set(match[2].split(',').map(item => item.trim()).filter(Boolean));
        let depth = 0;
        let end = i;
        for (; end < lines.length; end++) {
            for (const ch of lines[end]) {
                if (ch === '{') depth++;
                else if (ch === '}') depth--;
            }
            if (end > i && depth <= 0) break;
        }
        const body = lines.slice(i, end + 1);
        const declared = new Set([...params, ...knownGlobals]);
        body.forEach(line => declarationNames(line).forEach(name => declared.add(name)));
        body.forEach(line => declaredParams(line).forEach(name => declared.add(name)));
        body.forEach((line, offset) => {
            const reg = /\b(card|target|button|control)\b/g;
            let id;
            while ((id = reg.exec(line))) {
                const name = id[1];
                if (propertyAt(line, id.index)) continue;
                if (propertyKeyAt(line, id.index, name)) continue;
                if (declared.has(name)) continue;
                if (/^\s*[A-Za-z_$][\w$]*\s*:/.test(line)) continue;
                diagnostics.push({
                    file,
                    line: i + offset + 1,
                    message: `${hookName} callback uses '${name}', but its declared params are (${[...params].join(', ') || 'none'})`,
                });
            }
        });
    }
    return diagnostics;
}

function main() {
    const files = scanDirs.flatMap(dir => walk(dir));
    const diagnostics = [];

    for (const file of files) {
        const source = fs.readFileSync(file, 'utf8');
        const masked = maskSource(source);
        const { lines, depths } = getDepthBeforeLines(masked);
        diagnostics.push(...checkBlockScopedUses(file, lines, depths));
        diagnostics.push(...checkHookCallbackParams(file, lines));
    }

    if (!diagnostics.length) {
        console.log(`OK: checked ${files.length} files`);
        return;
    }

    console.error(`Found ${diagnostics.length} possible issue(s):`);
    for (const item of diagnostics) {
        console.error(`${path.relative(root, item.file)}:${item.line}: ${item.message}`);
    }
    process.exitCode = 1;
}

main();
