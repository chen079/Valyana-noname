import { lib, game, ui, get, ai, _status } from '../../../../noname.js';
import Valyana from './Valyana.js';
import poptips from './poptips.json'

export async function precontent(ValyanaCharacters) {
    if (ValyanaCharacters.enable) {
        //--------------------武将包--------------------//
        game.import('character', Valyana);
        //--------------------卡牌包--------------------//
    }
    for (let poptip of poptips) {
        lib.poptip.add(poptip);
    }
    //更新公告
    game.showExtensionChangeLog((() => {
        //更新告示
        _status.HDWJ_ChangeLog = [
            {
                type: 'text',
                data: [
                    '新人制作扩展，希望大家支持',
                    '新人技术不足，希望大家包涵',
                    '<a href="https://github.com/HuoDong-Update-Organization/HuoDong-update">点击前往活动武将Github仓库</a>'
                ],
            },
            {
                type: 'players',
                data: (() => {
                    _status.HDWJ_ChangeLog_character = {
                        'MiNikill': ['Myin_yuji', 'Mbaby_dc_sb_xunyu', 'Mbaby_sb_xiahoudun', 'Mbaby_dc_sb_lusu', 'Mbaby_yj_ganning', 'Mbaby_caoyi'],
                        'WeChatkill': ['wechat_dihuangxia', 'wechat_yanlongxia', 'wechat_hansimao', 'wechat_luotuo', 'wechat_yuehanniu', 'wechat_yingjiang', 'wechat_mashe', 'wechat_liubei', 'wechat_huanggai', 'wechat_shen_liubei', 'wechat_shen_luxun', 'wechat_kuailiangkuaiyue', 'wechat_weiyan', 'wechat_zhugezhan', 'wechat_yanwen', 'wechat_xiahouyuan', 'wechat_pangde', 'wechat_sunluban', 'wechat_jianyong'],
                    };
                    return Object.values(_status.HDWJ_ChangeLog_character).flat();
                })(),
            },
            {
                type: 'text',
                textAlign: 'left',
                get data() {
                    return [
                        'bugfix、素材补充、技能调整',
                        '添加在线更新功能（默认根据日期功能执行不同长度文件的增量更新，如果版本为最新则改为全量更新，仓库挂在Github，需要挂梯子）',
                        ...(() => {
                            const map = _status.HDWJ_ChangeLog_character ?? {};
                            return Object.keys(map).map(ext => {
                                const str = lib.translate[`${ext}_character_config`] || lib.translate[ext] || ext;
                                return `${str}：${map[ext].map(name => lib.translate[name]).join('、')}`;
                            });
                        })(),
                        '允许多开合纵抗秦/官渡之战事件',
                        '继续调整诸多未跟进版本的三国杀小程序武将技能，感谢@浮生半夏丷 的小程序内容整合',
                        '更新捉鬼驱邪系列武将的技能为新版/角色配音/人物介绍，感谢@魔界通棍母 的内容整合和素材提供',
                        '调整部分名人堂和杂谈系列武将的技能',
                        'To be continued...',
                    ];
                },
            },
        ];
        return _status.HDWJ_ChangeLog;
    })(), '活动武将');
}