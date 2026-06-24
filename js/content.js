import { lib, game, ui, get, ai, _status } from '../../../noname.js';
import { character } from '../packs/character.js'

export async function content(config, pack) {
    //设置评级
    for (const charName in character) {
        const char = character[charName]
        if (char.enable) {
            const rank = char.rank
            lib.rank.rarity[rank].push(charName)
        }
    }
}