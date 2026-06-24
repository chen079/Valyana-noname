import { lib, game, ui, get, ai, _status } from '../../../../noname.js';
export const changelog = {
    "1.0.0": [
        {
            type: 'text',
            data: [
                '钫酸是菜鸡',
                '<a href="https://github.com/chen079/Valyana-noname.git">点击前往瓦尔亚纳Github仓库</a>'
            ],
        },
        {
            type: 'players',
            data: (() => {
                _status.Valyana_ChangeLog_character = {
                    'Valyana': ['vl_fangsuan', 'vl_wangshuo'],
                };
                return Object.values(_status.Valyana_ChangeLog_character).flat();
            })(),
        },
        {
            type: 'text',
            textAlign: 'left',
            get data() {
                return [
                    ...(() => {
                        const map = _status.Valyana_ChangeLog_character ?? {};
                        return Object.keys(map).map(ext => {
                            const str = lib.translate[`${ext}_character_config`] || lib.translate[ext] || ext;
                            return `${str}：${map[ext].map(name => lib.translate[name]).join('、')}`;
                        });
                    })(),
                    'To be continued...',
                ];
            },
        },
    ]
}
const lastChangelog = changelog[Object.keys(changelog)[0]]
_status.Valyana_ChangeLog = lastChangelog
export default lastChangelog
