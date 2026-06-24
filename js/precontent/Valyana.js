import { lib, game, ui, get, ai, _status } from '../../../../noname.js';
import { character } from '../../packs/character.js'
import { characterIntro } from '../../packs/characterIntro.js'
import { card } from '../../packs/card.js'
import { characterSort } from '../../packs/characterSort.js'
import { dynamicTranslate } from '../../packs/dynamicTranslate.js'
import translate from '../../packs/translate.js'
import skill from '../../packs/skill.js'

const packs = function () {
    const Valyana = {
        name: 'Valyana',
        connect: true,
        characterSort: characterSort,
        character: character,
        characterIntro: characterIntro,
        card: card,
        skill: skill,
        dynamicTranslate: dynamicTranslate,
        translate: translate,
    };
    for (const i in Valyana.character) {
        if (Array.isArray(Valyana.character[i])) Valyana.character[i] = get.convertedCharacter(Valyana.character[i]);
        Valyana.character[i].trashBin ??= [];
        Valyana.character[i].dieAudios ??= [];
        Valyana.character[i].tempname ??= [];
        Valyana.character[i].img = `extension/瓦尔亚纳/image/character/${i}.jpg`;
        const skin = Valyana.character[i].trashBin.find(str => str.startsWith('character:'))?.split(':')[1];
        if (skin && files.image.character.files.includes(`${skin}.jpg`)) Valyana.character[i].img = `extension/瓦尔亚纳/image/character/${skin}.jpg`;
        Valyana.character[i].dieAudios.push('ext:瓦尔亚纳/audio/die:true');
        Valyana.translate[`#ext:瓦尔亚纳/audio/die/${i}:die`] ??= '点击播放阵亡配音';
        if (Valyana.translate[i] && !lib.translate[i + '_prefix'] && !Valyana.translate[i + '_prefix']) {
            if (Valyana.translate[i].startsWith('🐺')) Valyana.translate[i + '_prefix'] = '🐺';
        }
    }
    game.addGroup('vl_quanke', '犬', '犬科', { color: '#d83843'});
    game.addGroup('vl_maoke', '猫', '猫科', { color: '#d6a800'});
    lib.config.all.sgscharacters.push('Valyana');
    lib.translate['Valyana_character_config'] = '瓦尔亚纳';
    return Valyana;
};

export default packs;