import { lib, _status } from '../../../../noname.js';
import changelogData from './changelog.json';

function getPackCharacterText(characterMap) {
    return Object.keys(characterMap).map(ext => {
        const str = lib.translate[`${ext}_character_config`] || lib.translate[ext] || ext;
        return `${str}：${characterMap[ext].map(name => lib.translate[name] || name).join('、')}`;
    });
}

function getCharacterList(characterMap) {
    return Object.values(characterMap).flat();
}

function buildTextItem(version, data) {
    const text = data.text ?? [];
    const links = data.links ?? [];
    return {
        type: 'text',
        data: [
            data.title || `瓦尔亚纳 ${version} 历史更新日志`,
            ...links.map(link => `<a href="${link.href}">${link.text}</a>`),
            ...text,
        ],
    };
}

function buildCharacterTextItem(characterMap, changes) {
    return {
        type: 'text',
        textAlign: 'left',
        get data() {
            return [
                ...getPackCharacterText(characterMap),
                ...changes,
            ];
        },
    };
}

function buildVersionChangelog(version, data) {
    const characterMap = data.characters ?? {};
    const changes = data.changes ?? [];
    const list = [buildTextItem(version, data)];
    const characters = getCharacterList(characterMap);
    if (Object.keys(characterMap).length) {
        list.push({
            type: 'players',
            data: characters,
        });
    }
    if (Object.keys(characterMap).length || changes.length) {
        list.push(buildCharacterTextItem(characterMap, changes));
    }
    return list;
}

export const changelog = Object.fromEntries(
    Object.entries(changelogData).map(([version, data]) => [version, buildVersionChangelog(version, data)])
);

const lastChangelog = changelog[Object.keys(changelog)[0]];
_status.Valyana_ChangeLog = lastChangelog;
export default lastChangelog;
