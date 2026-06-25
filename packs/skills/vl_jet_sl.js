import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "showCharacterAfter",
    },
    hiddenSkill: true,
    filter(event, player) {
					return event.toShow.includes('vl_jet')
				},
    forced: true,
    init(player) {
					if (!player.storage.vl_jet_sl) player.storage.vl_jet_sl = false;
				},
    derivation: "luanwu",
    async content(event, trigger, player) {
					if (player.storage.vl_jet_sl == true) {
        						var list = [];
        						for (var name of lib.inpile) {
        							var type = get.type(name);
        							if (name == 'diaohulishan') continue
        							if (type != 'trick') continue;
        							var card = { name: name, isCard: true };
        							if (!get.tag(card, 'damage') && player.hasUseTarget(card)) {
        								list.push([type, '', name]);
        							}
        						}
        						const result = await player.chooseButton(['〖始乱〗：选择要使用的牌', [list, 'vcard']], function (button) {
        							return _status.event.player.getUseValue({ name: button.link[2], nature: button.link[3] });
        						}, function (button) {
        							return _status.event.player.hasUseTarget({ name: button.link[2], nature: button.link[3] });
        						}).forResult();
						if (result.bool) await player.chooseUseTarget(true, { name: result.links[0][2], isCard: true, nature: result.links[0][3] });
        					} else {
        						player.storage.vl_jet_sl = true;
        						// var next = game.createEvent('luanwu', false);
        						// next.player = player;
        						// next.target = game.filterPlayer((current) => current != player);
        						// next.setContent(lib.skill.luanwu.content);
        						player.useResult({ skill: "luanwu", targets: game.filterPlayer((current) => current != player) }, event)
        						return
        					}
    },
    ai: {
        effect: {
            target(card, player, target) {
							if (target == _status.currentPhase && get.tag(card, "damage")) {
								return [0, 2, 0, 0];
							}
						},
        },
    },
    t: {
        name: "始乱",
        info: `锁定技，隐匿技，当你登场时，若此为你的首次登场，你视为发动一次${get.poptip("luanwu")}，否则你视为使用一张非伤害类普通锦囊牌(【调虎离山】除外)`,
    },
};
