import { lib, game, ui, get, ai, _status } from '../../../../noname.js';
export const changelog = {
    "1.0.2": [
        {
            type: 'text',
            data: [
                '瓦尔亚纳 1.0.2 历史更新日志',
                '<a href="https://github.com/chen079/Valyana-noname.git">点击前往瓦尔亚纳Github仓库</a>'
            ],
        },
        {
            type: 'players',
            data: (() => {
                _status.Valyana_ChangeLog_character = {
                    'Valyana': ['vl_bofeng', 'vl_ciyu', 'vl_faers', 'vl_yinhu', 'vl_miya', 'vl_krikt', 'vl_qima'],
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
                    '新增世界观资料文档，补充瓦尔亚纳大陆设定说明。',
                    '补充多名角色头像资源，完善角色在选将界面的展示。',
                    '集中调整角色技能与动态描述，优化多个技能的触发、结算和显示文本。',
                    '优化角色加载与配置入口，更新角色、势力、分类等扩展数据。',
                    '更新文件索引，确保新增资源与技能文件能够被扩展正确加载。',
                ];
            },
        },
    ],
    "1.0.1": [
        {
            type: 'text',
            data: [
                '瓦尔亚纳 1.0.1 历史更新日志',
            ],
        },
        {
            type: 'players',
            data: (() => {
                _status.Valyana_ChangeLog_character = {
                    'Valyana': ['vl_chen', 'vl_azao', 'vl_yue', 'vl_ranxing'],
                    'ValyanaBoss': ['vl_boss_hars'],
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
                    '新增 Boss 分包，并加入 Boss 角色哈尔斯。',
                    '加入更新公告入口，可在扩展设置中查看历史更新内容。',
                    '重做或补充辰、阿早、玥、染星等角色技能与头像资源。',
                    '统一部分技能的 storage 读写方式，减少标记、状态和历史记录残留问题。',
                    '整理福瑞拓展迁移角色，修复部分势力、头像路径、技能归档与描述问题。',
                    '修复哈尔斯 Boss 技能、德拉古、圣尼特等角色技能的若干结算异常。',
                ];
            },
        },
    ],
    "1.0.0": [
        {
            type: 'text',
            data: [
                '瓦尔亚纳 1.0.0 历史更新日志',
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
                    '建立瓦尔亚纳扩展基础结构，加入入口、配置、角色包、技能包与资源索引。',
                    '首批加入 SP钫酸、SP望朔等挑担的游戏角色。',
                    '接入角色加载、技能翻译、稀有度、分包分类和头像映射流程。',
                    '补充基础 UI、图库、势力、buff 与 AI 相关功能。',
                    '迁移并整理福瑞拓展角色数据，为后续分包维护打基础。',
                ];
            },
        },
    ]
}
const lastChangelog = changelog[Object.keys(changelog)[0]]
_status.Valyana_ChangeLog = lastChangelog
export default lastChangelog
