import { lib, game, ui, get, ai, _status } from '../../../../noname.js';
import { character } from '../../packs/character.js'
import { furryCharacter } from '../../packs/FurryExtcharacter.js'

import { dynamicTranslate } from '../../packs/dynamicTranslate.js'
import { translation } from '../../packs/translation.js';
import { characterSubstitute } from '../../packs/characterSubstitute.js'

async function parseCharacterPack(name, characterPack) {
    const characterTitle = {}
    const translate = {}
    const skill = {};
    const extendCharacter = {}
    const characterIntro = {}
    const characterSort = {}
    const skillSet = new Set();

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
    const Valyana = await parseCharacterPack('Valyana', character)
    const furryExtPack = await parseCharacterPack('furryExtPack', furryCharacter)
    Object.assign(Valyana.translate, translation);
    Valyana.dynamicTranslate = dynamicTranslate
    furryExtPack.characterSubstitute = characterSubstitute
    addAvaterAndVideo(Valyana)
    addAvaterAndVideo(furryExtPack)
    game.addGroup('vl_quanke', '犬', '犬族', { color: '#d83843', image: 'ext:瓦尔亚纳/image/group/quanke.png' });
    game.addGroup('vl_maoke', '猫', '猫族', { color: '#d6a800', image: 'ext:瓦尔亚纳/image/group/maoke.png' });
    game.addGroup('longke', '龙', '龙族', { color: '#2d2d2d', image: 'ext:瓦尔亚纳/image/group/longke.png' });
    game.addGroup('jiqi', '机', '机器', { color: '#9733b8', image: 'ext:瓦尔亚纳/image/group/jiqi.png' });
    game.addGroup('haizu', '海', '海族', { color: '#303cdf', image: 'ext:瓦尔亚纳/image/group/haizu.png' })
    game.addGroup('vl_huli', '狐', '狐族', { color: '#d78523', image: 'ext:瓦尔亚纳/image/group/huli.png' })
    game.addGroup('vl_shizi', '狮', '狮族', { color: '#d7d123', image: 'ext:瓦尔亚纳/image/group/shizi.png' })
    game.addGroup('vl_langzu', '狼', '狼族', { color: '#3c403d', image: 'ext:瓦尔亚纳/image/group/langzu.png' })
    game.addGroup('vl_laohu', '虎', '虎族', { color: '#705114', image: 'ext:瓦尔亚纳/image/group/laohu.png' })
    game.addGroup('vl_tuzi', '兔', '兔族', { color: '#becfc2', image: 'ext:瓦尔亚纳/image/group/tuzi.png' })
    game.addGroup('vl_xiongzu', '熊', '熊族', { color: '#5b3d23', image: 'ext:瓦尔亚纳/image/group/xiongzu.png' })
    game.addGroup('vl_yang', '羊', '羊族', { color: '#a82066', image: 'ext:瓦尔亚纳/image/group/yang.png' })
    game.addGroup('vl_lu', '鹿', '鹿族', { color: '#3da820', image: 'ext:瓦尔亚纳/image/group/lu.png' })
    game.addGroup('vl_guai', '怪', '怪物', { color: '#581506', image: 'ext:瓦尔亚纳/image/group/guai.png' })
    game.addGroup('vl_shu', '鼠', '鼠族', { color: '#79706e', image: 'ext:瓦尔亚纳/image/group/shu.png' })
    lib.config.all.sgscharacters.push('Valyana');
    lib.translate['Valyana_character_config'] = '瓦尔亚纳';
    lib.config.all.sgscharacters.push('furryExtPack');
    lib.translate['furryExtPack_character_config'] = '福瑞扩展';
    return [Valyana, furryExtPack]
};

export default packs;
