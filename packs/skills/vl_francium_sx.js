import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    hubian: true,
    multitarget: true,
    complexTarget: true,
    delay: false,
    lose: false,
    multiline: true,
    discard: false,
    usable: 1,
    filterTarget(card, player, target) {
					if (player.storage.hubian) {
						return target.countCards('h') > 0
					} else {
						return player.canUse({ name: 'sha' }, target, false)
					}
				},
    selectTarget() {
					var player = _status.event.player
					if (player.storage.hubian) {
						return 2
					} else {
						return 1
					}
				},
    filterCard: true,
    filter(event, player) {
					if (player.storage.hubian) {
						return true
					} else {
						return player.countCards('h') > 0
					}
				},
    selectCard() {
					var player = _status.event.player
					if (player.storage.hubian) {
						return 0
					} else {
						return -1
					}
				},
    async content(event, trigger, player) {
					if (player.storage.hubian) {
						await event.targets[0].swapHandcards(event.targets[1]);
						await player.draw(2)
						await player.recover()
					} else {
						const {card} = await player.useCard(event.cards, { name: 'sha' }, event.targets[0], false).forResult();
						if (player.getHistory('sourceDamage', function (evt) {
							return card == evt.card;
						}).length) {
							await player.draw(Math.min(6, event.targets[0].maxHp))
						}
					}},
    ai: {
        threaten: 4.5,
        pretao: true,
        nokeep: true,
        order: 6,
        expose: 0.2,
        result: {
            player: 4,
            target(player, target) {
							if (player.storage.hubian) {
								if (!ui.selected.targets.length) return -Math.sqrt(target.countCards('h'));
								var h1 = ui.selected.targets[0].getCards('h'), h2 = target.getCards('h');
								if (h2.length > h1.length) return 0;
								var delval = get.value(h2, target) - get.value(h1, ui.selected.targets[0]);
								if (delval >= 0) return 0;
								return -delval * (h1.length - h2.length);
							} else {
								return -2
							}
						},
        },
    },
    t: {
        name: "生息",
        info: `${get.poptip("hubianji")}，出牌阶段限一次，<li>圣咏：你可以令两名有手牌的角色交换手牌，然后你摸两张牌并回复1点体力；<li>暗涌：你可以将所有手牌当无距离与次数限制的【杀】对一名其他角色使用，若此【杀】造成伤害，你摸X张牌（X为该角色体力上限且至多为6）。`,
    },
};
