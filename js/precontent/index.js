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

function getExtensionNode(name, waitms = 50, times = 20) {
    let menuBar;
    return new Promise(resolve => {
        const interval = setInterval(function (resolveMenu) {
            if (!ui.menuContainer || !ui.menuContainer.firstElementChild) return;
            const menu = ui.menuContainer.firstElementChild;
            menuBar = menu.querySelector('.menu-tab');
            if (!menuBar) return;
            clearInterval(interval);
            resolveMenu(menuBar);
        }, waitms, resolve);
    }).then(() => new Promise((resolve, reject) => {
        const extDivList = Array.from(menuBar.childNodes[4]._link.childNodes[0].childNodes);
        const callback = function (i, delay, resolveNode, rejectNode) {
            if (i > times) return rejectNode(new Error('Cannot find the extension'));
            const filterArray = extDivList.filter(div => div.innerHTML == name);
            if (!filterArray.length) {
                return setTimeout(() => callback(i + 1, delay, resolveNode, rejectNode), delay);
            }
            const leftBar = filterArray[0];
            if (typeof leftBar._initLink == 'function') leftBar._initLink();
            resolveNode([leftBar, leftBar.link]);
        };
        setTimeout(() => callback(1, waitms, resolve, reject), waitms);
    }));
}

function applyRainbowExtensionName(leftBar, name) {
    if (!document.getElementById('vl-rainbow-style')) {
        const style = document.createElement('style');
        style.id = 'vl-rainbow-style';
        style.textContent = `
@keyframes vl-rainbow-shift {
    0% { filter: hue-rotate(0deg); text-shadow: 0 0 6px rgba(255,255,255,0.45); }
    100% { filter: hue-rotate(360deg); text-shadow: 0 0 10px rgba(255,255,255,0.75); }
}`;
        document.head.appendChild(style);
    }
    leftBar.style.display = 'inline-flex';
    leftBar.style.alignItems = 'center';
    leftBar.style.whiteSpace = 'nowrap';
    leftBar.style.fontWeight = 'bold';
    leftBar.style.animation = 'vl-rainbow-shift 4s linear infinite';
    leftBar.innerHTML = [...name].map((char, index) => {
        return `<span style="display:inline-block; animation:vl-rainbow-shift 3s linear ${index * 0.18}s infinite;">${char}</span>`;
    }).join('');
}

function getValyanaBrawlCharacters() {
    const packNames = ['Valyana'];
    const list = [];
    packNames.forEach(packName => {
        const pack = lib.characterPack?.[packName];
        if (!pack) return;
        Object.keys(pack).forEach(name => {
            if (!list.includes(name)) list.push(name);
        });
    });
    return list.filter(name => lib.character[name] && !lib.filter.characterDisabled(name));
}

function chooseValyanaBrawlCharacter(player, list, list2, back) {
    const valyanaCharacters = getValyanaBrawlCharacters();
    if (!valyanaCharacters.length) return false;
    const sourceList = Array.isArray(back) ? list.concat(back) : list;
    const candidates = sourceList.filter(name => valyanaCharacters.includes(name));
    if (!candidates.length) return false;
    candidates.randomSort();
    const doubleCharacter = get.config('double_character');
    const choice = candidates[0];
    let choice2 = candidates.find(name => name !== choice);

    const getChoice = name => {
        const replaceList = lib.characterReplace?.[name];
        if (replaceList && replaceList.length) return replaceList.randomGet();
        return name;
    };
    if (doubleCharacter && choice2) {
        player.init(getChoice(choice), getChoice(choice2));
    } else {
        player.init(getChoice(choice));
    }
    if (player.identity === 'zhu' && game.players.length > 4 && !player.isInitFilter('noZhuHp')) {
        player.hp++;
        player.maxHp++;
        player.update();
    } else if (player.identity === 'mingzhong' && !player.isInitFilter('noZhuHp')) {
        player.hp++;
        player.maxHp++;
        player.update();
    }
    if (back) {
        sourceList.remove(get.sourceCharacter(player.name1));
        sourceList.remove(get.sourceCharacter(player.name2));
        const rest = sourceList.slice();
        back.length = 0;
        rest.forEach(name => back.push(name));
    } else {
        list.remove(get.sourceCharacter(player.name1));
        list.remove(get.sourceCharacter(player.name2));
    }
    return true;
}

function initValyanaBrawl() {
    if (!lib.config.extension_瓦尔亚纳_valyanaBrawl) return;
    const oldBrawl = _status.brawl || {};
    const oldChooseCharacterAi = oldBrawl.chooseCharacterAi;
    _status.brawl = oldBrawl;
    _status.brawl.chooseCharacterAi = function (player, list, list2, back) {
        if (oldChooseCharacterAi && oldChooseCharacterAi.apply(this, arguments) !== false) return true;
        return chooseValyanaBrawlCharacter(player, list, list2, back);
    };
}

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
    lib.arenaReady.push(initValyanaBrawl);
    for (let poptip of poptips) {
        lib.poptip.add(poptip);
    }
    getExtensionNode('瓦尔亚纳')
        .then(([leftBar]) => applyRainbowExtensionName(leftBar, '瓦尔亚纳'))
        .catch(() => { });
    //更新公告
    game.showExtensionChangeLog((() => changelog)(), '瓦尔亚纳');
}
