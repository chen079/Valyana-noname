import skill from "./skill.js";
import { character } from "./character.js";
const translate = {}
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
for (const charName in character) {
    const name = character[charName][4].find(item => item.startsWith('t:')).split(':')[1];
    translate[charName] = name;
}
console.log(translate)
export default translate;
