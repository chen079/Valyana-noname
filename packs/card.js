import vl_equip5_wxpp from './cards/vl_equip5_wxpp.js';
import vl_card_gzbj from './cards/vl_card_gzbj.js';

const cards = [
	vl_equip5_wxpp,
	vl_card_gzbj,
];

export const card = {};
export const skill = {};
export const translate = {};
export const list = [];

for (const item of cards) {
	Object.assign(card, item.card);
	Object.assign(skill, item.skill);
	Object.assign(translate, item.translate);
	list.push(...(item.list || []));
}

export default {
	name: 'ValyanaCard',
	connect: true,
	card,
	skill,
	translate,
	list,
};
