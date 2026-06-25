import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    round: 1,
    trigger: {
        player: "phaseBegin",
    },
    chat: ["突然..感觉..好困...", "眼皮好沉...", "要..睡着了...", "我...想睡觉...", "突如其来...的...困...意...", "突然..好困...", "谁在...那里...", "小心...有龙...", "有..埋伏...", "怎么...回事...", "好困...", "谁..在..那..."],
    content: function () {
					'step 0'
					if (!player.storage.vl_xit_xm) player.storage.vl_xit_xm_mark = [[], []];
					player.chat('陷入安眠吧！')
					var targets = game.filterPlayer();
					for (var targetx of targets) {
						player.storage.vl_xit_xm_mark[0].push(targetx);
						player.storage.vl_xit_xm_mark[1].push(targetx.hp);
						if (targetx != player) {
							targetx.addTempVuff('sleep', player)
							targetx.addTempVuff('yishang', player)
							targetx.chat(lib.skill["vl_xit_xm"].chat.randomGet())
						}
					}
					player.markSkill("vl_xit_xm_mark")
					'step 1'
					player.when('phaseAfter').then(() => {
						var storage = player.storage.vl_xit_xm_mark;
						for (var i = 0; i < storage[0].length; i++) {
							var target = storage[0][i];
							if (target && target.isIn()) {
								if (target.hp != storage[1][i]) {
									game.log(target, '将体力从', get.cnNumber(target.hp, true), '改为', get.cnNumber(storage[1][i], true));
									target.changeHp(storage[1][i] - target.hp)._triggered = null;
								}
							}
						}
						player.unmarkSkill('vl_xit_xm_mark');
						player.insertPhase()
					}).assign({
						mod: {
							targetInRange: function (card, player) {
								if (player == _status.currentPhase) return true;
							},
							cardUsable: function (card, player) {
								if (player == _status.currentPhase) return Infinity;
							},
						},
					})
				},
    subSkill: {
        mark: {
            marktext: "梦",
            intro: {
                markcount: function (storage, player) {
								if (!storage || !storage.length) return 0;
								return storage[0].length;
							},
                content: function (storage, player) {
								if (!storage || !storage.length) return '无信息';
								var str = '所有角色于回合开始时的体力值：<br>';
								for (var i = 0; i < storage[0].length; i++) {
									var str2 = get.translation(storage[0][i]) + '：' + storage[1][i];
									if (!storage[0][i].isIn()) str2 = '<span style="opacity:0.5">' + str2 + '（已故）</span>';
									str += '<li>' + str2;
								}
								return str;
							},
            },
        },
    },
    ai: {
        effect: {
            player_use: function (card, player, target) {
							if (get.tag(card, 'damage')) return 1.2;
						},
            target: function (card, player, target) {
							if (_status.event.type != 'phase') return;
							if (get.tag(card, 'recover')) {
								return [1, 1 - target.hp];
							}
						},
        },
    },
    t: {
        name: "袭梦",
        info: "每轮限一次。回合开始时，你可以记录场上所有角色的体力值，若如此做，你本回合使用牌无距离与次数限制且令所有其他角色获得1层「睡眠」和「易伤」直到回合结束，此回合结束后，将场上角色的体力值改为记录值，然后执行一个额外的回合。",
    },
};
