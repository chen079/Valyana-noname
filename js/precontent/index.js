import { lib, game, ui, get, ai, _status } from '../../../../noname.js';
import characterPacks from './loadCharacter.js';
import poptips from './poptips.json'
import changelog from './changelog.js'
import { vuffs } from '../../packs/vuffs/index.js';
import { initVuffSystem } from '../system/vuff.js';
import { initVpSystem } from '../system/vp.js';
import { initBrokenSystem } from '../system/broken.js';
import { initValyanaGallerySystem } from '../system/valyanaGallery.js';
import { getDisplayBlocs } from '../../packs/blocs.js';

export async function precontent(ValyanaCharacters) {
    lib.init.css(lib.assetURL + 'extension/瓦尔亚纳/css', 'vp');
    lib.init.css(lib.assetURL + 'extension/瓦尔亚纳/css', 'vuff');
    lib.init.css(lib.assetURL + 'extension/瓦尔亚纳/css', 'valyanaGallery');
    initVpSystem();
    initVuffSystem(vuffs);
    initBrokenSystem();
    initValyanaGallerySystem();
    const mergeShouzu = lib.config.extension_瓦尔亚纳_mergeShouzu;
    for (const [key, bloc] of Object.entries(getDisplayBlocs(mergeShouzu))) {
        await game.addGroup(key, bloc.name, bloc.longName, { color: bloc.color, image: bloc.image })
    }
    if (ValyanaCharacters.enable) {
        const packs = await characterPacks()
        //--------------------武将包--------------------//
        for (let i in packs) {
            game.import('character', packs[i]);
        }
        //--------------------卡牌包--------------------//
    }
    for (let poptip of poptips) {
        lib.poptip.add(poptip);
    }
    //更新公告
    game.showExtensionChangeLog((() => changelog)(), '瓦尔亚纳');
}
