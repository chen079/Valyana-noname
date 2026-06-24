import { lib, game, ui, get, ai, _status } from '../../../../noname.js';
import Valyana from './Valyana.js';
import poptips from './poptips.json'
import changelog from './changelog.js'

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
    game.showExtensionChangeLog((() => changelog)(), '瓦尔亚纳');
}