import { lib, game, ui, get, ai, _status } from '../../../../noname.js';
import Valyana from './Valyana.js';
import poptips from './poptips.json'
import changelog from './changelog.js'
import { vuffs } from '../../packs/vuffs/index.js';
import { initVuffSystem } from '../system/vuff.js';
import { initVpSystem } from '../system/vp.js';
import { initBrokenSystem } from '../system/broken.js';

export async function precontent(ValyanaCharacters) {
    lib.init.css(lib.assetURL + 'extension/瓦尔亚纳/css', 'vp');
    lib.init.css(lib.assetURL + 'extension/瓦尔亚纳/css', 'vuff');
    initVpSystem();
    initVuffSystem(vuffs);
    initBrokenSystem();
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
