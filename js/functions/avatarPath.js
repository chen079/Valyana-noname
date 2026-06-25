import { lib } from '../../../../noname.js'

export function avatarPath(name, flat) {
    if (!name) return null;
    const info = lib.character[name];
    const ext = info?.[4]?.find(item => typeof item === 'string' && item.startsWith('ext:'));
    if (!flat) return ext || `character:${name}`;
    if (ext) return ext.replace(/^ext:/, 'extension/');
    return `ext:瓦尔亚纳/image/character/${name}.jpg`;
}
