import { lib, game, ui, get, ai, _status } from '../../../../noname.js';
//角色包
import { character } from '../../packs/character.js'
import { furryCharacter } from '../../packs/furryExtcharacter.js'
import { boss as bossCharacters } from '../../packs/boss.js'
//翻译、势力等
import { dynamicTranslate } from '../../packs/dynamicTranslate.js'
import { translation } from '../../packs/translation.js';
import { characterSubstitute } from '../../packs/characterSubstitute.js'
import { getMergedShouzuBloc } from '../../packs/blocs.js';

let cachedSkillFiles;

async function getSkillFiles() {
    if (cachedSkillFiles) return cachedSkillFiles;
    try {
        const files = await lib.init.promises.json(`${lib.assetURL}extension/瓦尔亚纳/js/files.json`);
        cachedSkillFiles = (files?.packs?.skills?._files || [])
            .filter(file => file.endsWith('.js'))
            .map(file => file.slice(0, -3));
    } catch (error) {
        cachedSkillFiles = [];
    }
    return cachedSkillFiles;
}

async function parseCharacterPack(name, characterPack, options = {}) {
    const characterTitle = {}
    const translate = {}
    const skill = {};
    const extendCharacter = {}
    const characterIntro = {}
    const characterSort = {}
    const skillSet = new Set();

    const buildCharacterIntro = function (char) {
        let intro = char.intro || '';
        const credits = [
            ['原画设计', char.drawer],
            ['代码编写', char.coder],
            ['武将设计', char.designer],
            ['背景设计', char.writer],
        ].filter(item => item[1]);
        if (credits.length) {
            intro += '<br><br>' + credits.map(item => item[0] + '：' + item[1]).join('<br>');
        }
        return intro;
    };

    for (const charName in characterPack) {
        const char = characterPack[charName]
        if (char.enable) {
            const title = char.title;
            const name = char.name;
            const intro = buildCharacterIntro(char)
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
            const bloc = options.mergeShouzu ? getMergedShouzuBloc(char.bloc) : char.bloc;
            extendCharacter[charName] = [char.gender, bloc, char.hp, skills, addition]
            if (rank && lib.rank?.rarity?.[rank] && !lib.rank.rarity[rank].includes(charName)) lib.rank.rarity[rank].push(charName);
        }
    }

    const importSkill = async function (skillName) {
        if (skill[skillName]) return;
        let module;
        try {
            module = await import(`../../packs/skills/${skillName}.js`);
        } catch (error) {
            if (skillSet.has(skillName)) throw error;
            return;
        }
        skill[skillName] = module.default; // 取默认导出
        const derivation = module.default?.derivation;
        if (derivation) {
            const list = Array.isArray(derivation) ? derivation : [derivation];
            for (const name of list) {
                if (typeof name == 'string' && name.startsWith('vl_')) await importSkill(name);
            }
        }
    };

    const skillFiles = await getSkillFiles();
    await Promise.all([...new Set([...skillSet, ...skillFiles])].map(importSkill));

    for (const skillName in skill) {
        if (skill[skillName].t) {
            const name = skill[skillName].t.name
            const info = skill[skillName].t.info
            const taici = skill[skillName].t.taici
            if (name) translate[skillName] = name;
            if (info) translate[skillName + '_info'] = info;
            if (Array.isArray(taici)) {
                skill[skillName].audio ??= `ext:瓦尔亚纳/audio/skill:${taici.length}`;
                taici.forEach((text, index) => {
                    translate['#ext:瓦尔亚纳/audio/skill/' + skillName + (index + 1)] = text;
                });
            }
        }
    }

    return {
        name: name,
        connect: true,
        characterSort: characterSort,
        character: extendCharacter,
        characterIntro: characterIntro,
        characterTitle: characterTitle,
        skill: skill,
        translate: translate,
    }
}

function addAvaterAndVideo(parsedPack) {
    for (const i in parsedPack.character) {
        if (Array.isArray(parsedPack.character[i])) parsedPack.character[i] = get.convertedCharacter(parsedPack.character[i]);
        parsedPack.character[i].trashBin ??= [];
        parsedPack.character[i].dieAudios ??= [];
        parsedPack.character[i].tempname ??= [];
        parsedPack.character[i].img = `extension/瓦尔亚纳/image/character/${i}.jpg`;
        parsedPack.character[i].dieAudios.push('ext:瓦尔亚纳/audio/die:true');
        parsedPack.translate[`#ext:瓦尔亚纳/audio/die/${i}:die`] ??= '点击播放阵亡配音';
    }
}

const packs = async function () {
    const parseOptions = {
        mergeShouzu: lib.config.extension_瓦尔亚纳_mergeShouzu,
    };
    const loadFurryExtPack = lib.config.extension_瓦尔亚纳_loadFurryExtPack;
    const Valyana = await parseCharacterPack('Valyana', character, parseOptions)
    const bossPack = await parseCharacterPack('ValyanaBoss', bossCharacters, parseOptions)
    const importedPacks = [Valyana, bossPack];
    Object.assign(Valyana.translate, translation);
    Valyana.dynamicTranslate = dynamicTranslate
    Valyana.characterSubstitute = characterSubstitute
    addAvaterAndVideo(Valyana)
    addAvaterAndVideo(bossPack)
    lib.config.all.sgscharacters.push('Valyana');
    lib.translate['Valyana_character_config'] = '瓦尔亚纳';
    lib.config.all.sgscharacters.push('ValyanaBoss');
    lib.translate['ValyanaBoss_character_config'] = '瓦尔亚纳Boss';
    if (loadFurryExtPack) {
        const furryExtPack = await parseCharacterPack('furryExtPack', furryCharacter, parseOptions)
        addAvaterAndVideo(furryExtPack)
        lib.config.all.sgscharacters.push('furryExtPack');
        lib.translate['furryExtPack_character_config'] = 'FR旧扩展';
        importedPacks.push(furryExtPack);
    }
    return importedPacks
};

export default packs;
