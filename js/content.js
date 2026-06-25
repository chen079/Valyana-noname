import { lib, game, ui, get, ai, _status } from '../../../noname.js';
import { character } from '../packs/character.js'
import { initFunctions } from './functions.js';

export async function content(config, pack) {
    //加载函数
    initFunctions(lib, game, ui, get, ai, _status)
    //设置评级
    for (const charName in character) {
        const char = character[charName]
        if (char.enable) {
            const rank = char.rank
            lib.rank.rarity[rank].push(charName)
        }
    }
}