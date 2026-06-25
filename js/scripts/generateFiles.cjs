// generateFiles.cjs
const fs = require('fs');
const path = require('path');

function loadGitignore(dirPath) {
    const gitignorePath = path.join(dirPath, '.gitignore');
    try {
        if (fs.existsSync(gitignorePath)) {
            const content = fs.readFileSync(gitignorePath, 'utf-8');
            return content
                .split('\n')
                .map(line => line.trim())
                .filter(line => line && !line.startsWith('#'));
        }
    } catch (err) {
        console.warn(`读取 .gitignore 失败: ${err.message}`);
    }
    return [];
}

function shouldIgnore(itemName, relativePath, ignoreRules) {
    for (const rule of ignoreRules) {
        const isDirRule = rule.endsWith('/');
        const cleanRule = isDirRule ? rule.slice(0, -1) : rule;
        
        // 精确匹配
        if (itemName === cleanRule) {
            return true;
        }
        
        // 通配符匹配
        if (rule.includes('*')) {
            const regexPattern = rule
                .replace(/\./g, '\\.')
                .replace(/\*/g, '.*');
            const regex = new RegExp(`^${regexPattern}$`);
            if (regex.test(itemName)) {
                return true;
            }
        }
        
        // 路径包含
        if (relativePath.includes(cleanRule)) {
            return true;
        }
    }
    return false;
}

function generateFileTreeSync(dirPath, options = {}) {
    const {
        extraIgnore = ['node_modules', '.git'],
        useGitignore = true,
        basePath = dirPath
    } = options;

    try {
        const items = fs.readdirSync(dirPath, { withFileTypes: true });
        const result = {};
        
        let gitignoreRules = [];
        if (useGitignore) {
            gitignoreRules = loadGitignore(dirPath);
        }
        
        const allIgnoreRules = [...gitignoreRules, ...extraIgnore];

        for (const item of items) {
            const itemPath = path.join(dirPath, item.name);
            const relativePath = path.relative(basePath, itemPath);
            
            if (shouldIgnore(item.name, relativePath, allIgnoreRules)) {
                continue;
            }

            if (item.isDirectory()) {
                const subTree = generateFileTreeSync(itemPath, {
                    ...options,
                    basePath: basePath
                });
                if (Object.keys(subTree).length > 0 || (subTree._files && subTree._files.length > 0)) {
                    result[item.name] = subTree;
                }
            } else {
                if (!result._files) {
                    result._files = [];
                }
                result._files.push(item.name);
            }
        }

        return result;
    } catch (err) {
        console.error(`读取目录失败 (${dirPath}): ${err.message}`);
        return {};
    }
}

function printTree(tree, prefix = '') {
    const keys = Object.keys(tree);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const isLast = i === keys.length - 1;
        const connector = isLast ? '└── ' : '├── ';
        
        if (key === '_files') {
            const files = tree[key];
            files.forEach((file, index) => {
                const isFileLast = index === files.length - 1;
                const fileConnector = isFileLast ? '└── ' : '├── ';
                console.log(prefix + fileConnector + file);
            });
        } else {
            console.log(prefix + connector + key + '/');
            const childPrefix = prefix + (isLast ? '    ' : '│   ');
            printTree(tree[key], childPrefix);
        }
    }
}

// ============= 修改这里：配置要遍历的路径和输出路径 =============

// 获取当前脚本所在目录
const scriptDir = __dirname;

// 要遍历的目录：当前目录的上两级 (../../)
const targetDir = path.resolve(scriptDir, '../../');

// 输出目录：当前目录的上一级 (../)
const outputDir = path.resolve(scriptDir, '../');
const outputFile = path.join(outputDir, 'files.json');

// =============================================================

console.log(`📂 脚本位置: ${scriptDir}`);
console.log(`📁 遍历目录: ${targetDir}`);
console.log(`💾 输出文件: ${outputFile}`);
console.log('');

// 检查目标目录是否存在
if (!fs.existsSync(targetDir)) {
    console.error(`❌ 错误: 目标目录不存在: ${targetDir}`);
    process.exit(1);
}

// 确保输出目录存在
if (!fs.existsSync(outputDir)) {
    console.log(`创建输出目录: ${outputDir}`);
    fs.mkdirSync(outputDir, { recursive: true });
}

console.log('⏳ 正在生成文件树...');

try {
    // 生成文件树
    const tree = generateFileTreeSync(targetDir, {
        useGitignore: true,
        extraIgnore: ['node_modules', '.git', '.vscode', 'dist', 'build']
    });
    
    // 输出到控制台（树形结构）
    console.log('\n📊 文件树结构:');
    printTree(tree);
    
    // 保存到 JSON 文件
    fs.writeFileSync(outputFile, JSON.stringify(tree, null, 2));
    console.log(`\n✅ 文件树已保存到: ${outputFile}`);
    
    // 统计信息
    const fileCount = countFiles(tree);
    const dirCount = countDirs(tree);
    console.log(`📊 统计: ${dirCount} 个文件夹, ${fileCount} 个文件`);
    console.log(`📄 JSON 文件大小: ${(fs.statSync(outputFile).size / 1024).toFixed(2)} KB`);
    
} catch (err) {
    console.error('❌ 生成失败:', err.message);
    console.error(err.stack);
}

/**
 * 统计文件总数
 */
function countFiles(tree) {
    let count = 0;
    for (const key in tree) {
        if (key === '_files') {
            count += tree[key].length;
        } else {
            count += countFiles(tree[key]);
        }
    }
    return count;
}

/**
 * 统计文件夹总数
 */
function countDirs(tree) {
    let count = 0;
    for (const key in tree) {
        if (key !== '_files') {
            count += 1 + countDirs(tree[key]);
        }
    }
    return count;
}