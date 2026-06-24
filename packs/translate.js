import skill from "./skill.js";
import { character } from "./character.js";
const translate = {}
for (const skillName in skill) {
    translate[skillName] = skill[skillName].t.name;
    translate[skillName + '_info'] = skill[skillName].t.info;
}
for (const charName in character) {
    const name = character[charName][4].find(item => item.startsWith('t:')).split(':')[1];
    translate[charName] = name;
}
export default translate;
