import { game, get } from '../../../../noname.js';

const card = {
	image: 'ext:瓦尔亚纳/image/card/vl_card_gzbj.png',
	audio: true,
	fullskin: true,
	type: 'trick',
	enable: true,
	multiline: true,
	selectTarget: -1,
	multitarget: true,
	filterTarget: true,
	content() {
		'step 0'
		const global = game.players.slice(0);
		event.num = 0;
		for (let i = 0; i < global.length; i++) {
			event.num += global[i].countCards('h');
		}
		event.num = Math.floor(event.num / global.length);
		'step 1'
		event.targets = targets.slice(0).sortBySeat();
		'step 2'
		event.target = event.targets.shift();
		const num = event.num - event.target.countCards('h');
		if (num < 0) {
			event.target.chooseToDiscard('h', -num, true);
		} else if (num > 0) {
			event.target.draw(num);
		}
		'step 3'
		if (event.targets.length) event.goto(2);
	},
	ai: {
		wuxie() {
			if (Math.random() < 0.5) return 0;
		},
		basic: {
			order: 3,
			useful: 0.5,
		},
		result: {
			player(player) {
				let benefit = 0;
				let humful = 0;
				const good = game.filterPlayer(current => get.attitude(player, current) > 0);
				const bad = game.filterPlayer(current => get.attitude(player, current) < 0);
				for (let i = 0; i < good.length; i++) {
					benefit += good[i].countCards('h');
				}
				benefit = Math.floor(benefit / Math.max(1, good.length));
				for (let j = 0; j < bad.length; j++) {
					humful += bad[j].countCards('h');
				}
				humful = Math.floor(humful / Math.max(1, bad.length));
				return benefit - humful;
			},
			target(player, target) {
				if (player.hasUnknown(2)) return 0;
				const global = game.players.slice(0);
				let num = 0;
				for (let i = 0; i < global.length; i++) {
					num += global[i].countCards('h');
				}
				num = Math.floor(num / global.length);
				return num - target.countCards('h');
			},
		},
		tag: {
			multitarget: 1,
		},
	},
};

const translate = {
	vl_card_gzbj: '寡众不均',
	vl_card_gzbj_info: '出牌阶段，对所有角色使用。所有目标将手牌数调整至X（X为场上所有玩家手牌数的平均值并向下取整）。',
};

const list = [['heart', 9, 'vl_card_gzbj']];

export default {
	card: {
		vl_card_gzbj: card,
	},
	skill: {},
	translate,
	list,
};
