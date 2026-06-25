import { lib, game, ui, get, ai, _status } from '../../../../noname.js';
import { character } from '../../packs/character.js'
import { card } from '../../packs/card.js'
import { dynamicTranslate } from '../../packs/dynamicTranslate.js'
import { translation } from '../../packs/translation.js';
import { createFurryMigrationPack } from '../../packs/furryMigration.js';

const characterTitle = {}
const translate = {}
const skill = {};
const extendCharacter = {}
const characterIntro = {}
const characterSort = {}
const skillSet = new Set();
const migratedPack = createFurryMigrationPack();
const characterImageSource = {};

for (const charName in character) {
    const char = character[charName]
    if (char.enable) {
        const title = char.title;
        const name = char.name;
        const intro = char.intro
        const skills = char.skills
        const sort = char.sort
        const pack = char.pack
        const prefix = char.prefix
        const VP = char.vp
        const addition = char.addition

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
        characterImageSource[charName] = charName;
    }
}

for (const charName in migratedPack.character) {
    const char = migratedPack.character[charName];
    const addition = Array.isArray(char[4]) ? char[4] : [];
    const skills = Array.isArray(char[3]) ? char[3] : [];
    const rank = migratedPack.ranks[charName];
    extendCharacter[charName] = [char[0], char[1], char[2], skills, addition];
    characterImageSource[charName] = migratedPack.imageSources[charName] || charName;
    if (migratedPack.characterIntro[charName]) characterIntro[charName] = migratedPack.characterIntro[charName];
    if (migratedPack.characterTitle[charName]) characterTitle[charName] = migratedPack.characterTitle[charName];
    if (!characterSort.Valyana) characterSort.Valyana = {};
    if (!characterSort.Valyana.vl_furry_migration) characterSort.Valyana.vl_furry_migration = [];
    characterSort.Valyana.vl_furry_migration.push(charName);
    if (rank && lib.rank?.rarity?.[rank] && !lib.rank.rarity[rank].includes(charName)) lib.rank.rarity[rank].push(charName);
    skills.forEach(skillName => skillSet.add(skillName));
}

const skillIndex = [...skillSet];

await Promise.all(skillIndex.map(async (skillName) => {
    if (migratedPack.skill[skillName]) {
        skill[skillName] = migratedPack.skill[skillName];
        return;
    }
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

Object.assign(translate, migratedPack.translate);
Object.assign(translate, translation);
translate.vl_furry_migration = '福瑞迁移';

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
        dynamicTranslate: { ...migratedPack.dynamicTranslate, ...dynamicTranslate },
        translate: translate,
    };
    for (const i in Valyana.character) {
        if (Array.isArray(Valyana.character[i])) Valyana.character[i] = get.convertedCharacter(Valyana.character[i]);
        Valyana.character[i].trashBin ??= [];
        Valyana.character[i].dieAudios ??= [];
        Valyana.character[i].tempname ??= [];
        if (migratedPack.imageSources[i]) {
            Valyana.character[i].img = `extension/福瑞拓展/image/skin/origin-standard/${migratedPack.imageSources[i]}.jpg`;
            Valyana.character[i].trashBin.push(`ext:福瑞拓展/image/skin/origin-standard/${migratedPack.imageSources[i]}.jpg`);
        } else {
            Valyana.character[i].img = `extension/瓦尔亚纳/image/character/${i}.jpg`;
        }
        Valyana.character[i].dieAudios.push('ext:瓦尔亚纳/audio/die:true');
        Valyana.translate[`#ext:瓦尔亚纳/audio/die/${i}:die`] ??= '点击播放阵亡配音';
    }
    game.addGroup('vl_quanke', '犬', '犬科', { color: '#d83843', image: 'ext:瓦尔亚纳/image/group/quanke.png' });
    game.addGroup('vl_maoke', '猫', '猫科', { color: '#d6a800', image: 'ext:瓦尔亚纳/image/group/maoke.png' });
    lib.config.all.sgscharacters.push('Valyana');
    lib.translate['Valyana_character_config'] = '瓦尔亚纳';
    return Valyana;
};

export default packs;
