import { lib, game, ui, get, ai, _status } from '../../../../noname.js';
import { character } from '../../packs/character.js'
import { furryCharacter } from '../../packs/furryCharacter.js'
import { card } from '../../packs/card.js'
import { dynamicTranslate } from '../../packs/dynamicTranslate.js'
import { translation } from '../../packs/translation.js';

const characterTitle = {}
const translate = {}
const skill = {};
const extendCharacter = {}
const characterIntro = {}
const characterSort = {}
const skillSet = new Set();

for (const characterPack of [character, furryCharacter]) {
    for (const charName in characterPack) {
        const char = characterPack[charName]
        if (char.enable) {
            const title = char.title;
            const name = char.name;
            const intro = char.intro
            const skills = char.skills
            const sort = char.sort
            const pack = char.pack
            const prefix = char.prefix
            const VP = char.vp
            const addition = Array.isArray(char.addition) ? char.addition.slice() : []
            const rank = char.rank

            if (title) characterTitle[charName] = title;
            if (name) translate[charName] = name
            if (prefix) translate[charName + '_prefix'] = prefix
            if (intro) characterIntro[charName] = intro
            if (VP) addition.push('VP:' + VP)
            if (pack && sort) {
                if (!characterSort[pack]) characterSort[pack] = {}
                if (!characterSort[pack][sort]) characterSort[pack][sort] = [];
                characterSort[pack][sort].push(charName);
            }
            if (skills && Array.isArray(skills)) {
                skills.forEach(skillName => skillSet.add(skillName));
            }
            extendCharacter[charName] = [char.gender, char.bloc, char.hp, skills, addition]
            if (rank && lib.rank?.rarity?.[rank] && !lib.rank.rarity[rank].includes(charName)) lib.rank.rarity[rank].push(charName);
        }
    }
}

const skillIndex = [...skillSet];

await Promise.all(skillIndex.map(async (skillName) => {
    const module = await import(`../../packs/skills/${skillName}.js`);
    skill[skillName] = module.default; // 取默认导出
}));

for (const skillName in skill) {
    if (skill[skillName].t) {
        const name = skill[skillName].t.name
        const info = skill[skillName].t.info
        const taici = skill[skillName].t.taici
        if (name) translate[skillName] = name;
        if (info) translate[skillName + '_info'] = info;
        if (Array.isArray(taici)) {
            taici.forEach((text, index) => {
                translate['#ext:瓦尔亚纳/audio/skill/' + skillName + (index + 1)] = text;
            });
        }
    }
}

Object.assign(translate, translation);

const packs = function () {
    const Valyana = {
        name: 'Valyana',
        connect: true,
        characterSort: characterSort,
        character: extendCharacter,
        characterIntro: characterIntro,
        characterTitle: characterTitle,
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
        Valyana.character[i].dieAudios.push('ext:瓦尔亚纳/audio/die:true');
        Valyana.translate[`#ext:瓦尔亚纳/audio/die/${i}:die`] ??= '点击播放阵亡配音';
    }
    game.addGroup('vl_quanke', '犬', '犬科', { color: '#d83843', image: 'ext:瓦尔亚纳/image/group/quanke.png' });
    game.addGroup('vl_maoke', '猫', '猫科', { color: '#d6a800', image: 'ext:瓦尔亚纳/image/group/maoke.png' });
    game.addGroup('longke', '龙', '龙族', { color: '#6b63ff', image: 'ext:瓦尔亚纳/image/group/longke.png' });
    game.addGroup('jiqi', '机', '机器', { color: '#4b9ad8', image: 'ext:瓦尔亚纳/image/group/jiqi.png' });
    lib.config.all.sgscharacters.push('Valyana');
    lib.translate['Valyana_character_config'] = '瓦尔亚纳';
    return Valyana;
};

export default packs;
