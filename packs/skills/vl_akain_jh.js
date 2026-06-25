import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    filter: function (event, player) {
					return player.Vp > 0
				},
    vpSkill: true,
    content: function () {
					'step 0'
					player.consumeVp()
					event.damageCards = lib.inpile.filter(i => {
						return get.tag({ name: i }, 'damage') > 0
					}).map(i => '【' + get.translation(i) + '】')
					if (!_status.characterlist) {
						lib.skill.pingjian.initList();
					}
					_status.characterlist.randomSort();
					var list = [];
					for (var name of _status.characterlist) {
						var info = lib.character[name];
						if (info[3].some(function (skill) {
							var info = get.skillInfoTranslation(skill);
							if (!info.includes('弃置') && event.damageCards.every(i => !info.includes(i))) return false;
							return true
						})) {
							list.push(name);
							if (list.length >= 4) break;
						}
					}
					if (!list.length) event.finish();
					else {
						player.chooseButton([
							'激活：请选择一张作为“法球”' + (player.group == 'wei' ? '（弃置）' : '（伤害牌名）') + '置入宝物区',
							[list, function (item, type, position, noclick, node) {
								return lib.skill.vl_akain_jh.$createButton(item, type, position, noclick, node);
							}],
						], 1, true).set('ai', function (button) {
							var name = button.link;
							var info = lib.character[name];
							var skills = info[3].filter(function (skill) {
								var info = get.skillInfoTranslation(skill);
								if (player.group == 'wei') {
									if (!info.includes('弃置')) return false;
								} else {
									if (event.damageCards.every(i => !info.includes(i))) return false
								}
								return true
							});
							var eff = 0.2;
							for (var i of skills) {
								eff += get.skillRank(i, 'in');
							}
							return eff;
						})
					}
					'step 1'
					if (result.bool) {
						var list = result.links;
						game.addVideo('skill', player, ['vl_akain_jh', [list]])
						game.broadcastAll(function (list) {
							for (var name of list) lib.skill.vl_akain_jh.createCard(player, name);
						}, list);
						var cards = list.map(function (name) {
							var card = game.createCard('vl_akain_jh_' + name, 'none');
							return card;
						});
						player.$gain2(cards);
						game.delayx();
						for (var card of cards) player.equip(card);
					}
				},
    $createButton: function (item, type, position, noclick, node) {
					node = ui.create.buttonPresets.character(item, 'character', position, noclick);
					const info = lib.character[item];
					const skills = info[3].filter(function (skill) {
						var info = get.skillInfoTranslation(skill);
						var damageCards = lib.inpile.filter(i => {
							return get.tag({ name: i }, 'damage') > 0
						}).map(i => '【' + get.translation(i) + '】')
						if (!info.includes('弃置') && damageCards.every(i => !info.includes(i))) return false;
						return true
					});
					if (skills.length) {
						const skillstrs = skills.map(i=>`[${get.translation(i)}]`);
							// .join('<br>');
						const skillnodes = [];
						let group;
						let sinfo;
						for(let i=0;i<=skills.length-1;i++){
							group="shu";
							sinfo = get.skillInfoTranslation(skills[i]);
							if(sinfo.includes("弃置")) group="jin";
							if(lib.inpile.filter(i => {
								return get.tag({ name: i }, 'damage') > 0
							}).map(i => '【' + get.translation(i) + '】').every(i => !sinfo.includes(i))){
								if(group == "jin"){
									group = "wei";
								}else{
									group = "qun";
								}
							}
							let skillnode = ui.create.caption(
								`<div class="text" data-nature=${get.groupnature(group, 'raw')
								}m style="font-family: ${(lib.config.name_font || 'xinwei')
								},xinwei">${skillstrs[i]}</div>`, node);
							skillnode.style.left = '2px';
							skillnode.style.bottom = (2+15*i)+'px';
							skillnodes.push(skillnode);
						}
					}
					node._customintro = function (uiintro, evt) {
						const character = node.link, characterInfo = get.character(node.link);
						let capt = get.translation(character);
						uiintro.add(capt);

						if (lib.characterTitle[node.link]) {
							uiintro.addText(get.colorspan(lib.characterTitle[node.link]));
						}
						for (let i = 0; i < skills.length; i++) {
							if (lib.translate[skills[i] + '_info']) {
								let translation = lib.translate[skills[i] + '_ab'] || get.translation(skills[i]).slice(0, 2);
								if (lib.skill[skills[i]] && lib.skill[skills[i]].nobracket) {
									uiintro.add('<div><div class="skilln">' + get.translation(skills[i]) + '</div><div>' + get.skillInfoTranslation(skills[i]) + '</div></div>');
								}
								else {
									uiintro.add('<div><div class="skill">【' + translation + '】</div><div>' + get.skillInfoTranslation(skills[i]) + '</div></div>');
								}
								if (lib.translate[skills[i] + '_append']) {
									uiintro._place_text = uiintro.add('<div class="text">' + lib.translate[skills[i] + '_append'] + '</div>')
								}
							}
						}
					}

					return node;
				},
    video: function (player, info) {
					for (var name of info[0]) {
						lib.skill.vl_akain_jh.createCard(name);
					}
				},
    createCard: function (player, name) {
					if (!_status.postReconnect.vl_akain_jh) _status.postReconnect.vl_akain_jh = [
						function (list) {
							for (var name of list) lib.skill.vl_akain_jh.createCard(name);
						}, []
					];
					_status.postReconnect.vl_akain_jh[1].add(name)
					if (!lib.card['vl_akain_jh_' + name]) {
						if (lib.translate[name + '_ab']) lib.translate['vl_akain_jh_' + name] = lib.translate[name + '_ab'];
						else lib.translate['vl_akain_jh_' + name] = lib.translate[name];
						var info = lib.character[name];
						var card = {
							fullimage: true,
							image: 'character:' + name,
							type: 'equip',
							subtype: 'equip5',
							enable: true,
							originalSkill: info[3],
							selectTarget: -1,
							filterCard: function (card, player, target) {
								if (player != target) return false;
								return target.canEquip(card, true);
							},
							modTarget: true,
							allowMultiple: false,
							content: lib.element.content.equipCard,
							toself: true,
							ai: {},
							skills: ['vl_akain_jh_destroy'],
						}
						var skills = info[3].filter(function (skill) {
							var info = get.skillInfoTranslation(skill);
							if (player.group == 'wei') {
								if (!info.includes('弃置')) return false;
							} else {
								var damageCards = lib.inpile.filter(i => {
									return get.tag({ name: i }, 'damage') > 0
								}).map(i => '【' + get.translation(i) + '】')
								if (damageCards.every(i => !info.includes(i))) return false
							}
							return true
						});
						var str = '锁定技。';
						if (skills.length) {
							card.skills.addArray(skills);
							str += '你视为拥有技能';
							for (var skill of skills) {
								str += '〖' + get.translation(skill) + '〗';
								str += '、';
							}
							str = str.slice(0, str.length - 1);
							str += '；';
							card.ai.equipValue = function (card, player) {
								let val = player.maxHp;
								if (player.hasSkill('vl_akain_jh')) val *= 0.4;
								else val *= 0.6;
								return val += skills.length;
							};
						}
						str += '此牌离开你的装备区后，改为置入剩余武将牌牌堆。';
						lib.translate['vl_akain_jh_' + name + '_info'] = str;
						var append = '';
						if (skills.length) {
							for (var skill of skills) {
								if (lib.skill[skill].nobracket) {
									append += '<div class="skilln">' + get.translation(skill) + '</div><div><span style="font-family: yuanli">' + get.skillInfoTranslation(skill) + '</span></div><br><br>';
								}
								else {
									var translation = lib.translate[skill + '_ab'] || get.translation(skill).slice(0, 2);
									append += '<div class="skill">【' + translation + '】</div><div><span style="font-family: yuanli">' + get.skillInfoTranslation(skill) + '</span></div><br><br>';
								}
							}
							str = str.slice(0, str.length - 8);
						}
						lib.translate['vl_akain_jh_' + name + '_append'] = append;
						lib.card['vl_akain_jh_' + name] = card;
					}
				},
    ai: {
        order: 9,
        result: {
            player: 1,
        },
    },
    group: "vl_akain_jh_1",
    subSkill: {
        "1": {
            trigger: {
                player: "changeGroupAfter",
            },
            direct: true,
            content: function () {
							'step 0'
							player.gainVp(1)
							'step 1'
							if (player.getEquip(5) != null && player.getEquip(5).name.indexOf('vl_akain_jh_') != -1) {
								var name = player.getEquip(5).name
								var card = lib.card[name]
								var skills = card.originalSkill.slice(0)
								skills = skills.filter(function (skill) {
									var info = get.skillInfoTranslation(skill);
									if (player.group == 'wei') {
										if (!info.includes('弃置')) return false;
									} else {
										var damageCards = lib.inpile.filter(i => {
											return get.tag({ name: i }, 'damage') > 0
										}).map(i => '【' + get.translation(i) + '】')
										if (damageCards.every(i => !info.includes(i))) return false
									}
									return true
								});
								var str = '锁定技。';
								if (skills.length) {
									card.skills.addArray(skills);
									str += '你视为拥有技能';
									for (var skill of skills) {
										str += '〖' + get.translation(skill) + '〗';
										str += '、';
									}
									str = str.slice(0, str.length - 1);
									str += '；';
									card.ai.equipValue = function (card, player) {
										let val = maxHp;
										if (player.hasSkill('vl_akain_jh')) val *= 0.4;
										else val *= 0.6;
										return val += skills.length;
									};
								}
								str += '此牌离开你的装备区后，改为置入剩余武将牌牌堆。';
								lib.translate['vl_akain_jh_' + name + '_info'] = str;
								var append = '';
								if (skills.length) {
									for (var skill of skills) {
										if (lib.skill[skill].nobracket) {
											append += '<div class="skilln">' + get.translation(skill) + '</div><div><span style="font-family: yuanli">' + get.skillInfoTranslation(skill) + '</span></div><br><br>';
										}
										else {
											var translation = lib.translate[skill + '_ab'] || get.translation(skill).slice(0, 2);
											append += '<div class="skill">【' + translation + '】</div><div><span style="font-family: yuanli">' + get.skillInfoTranslation(skill) + '</span></div><br><br>';
										}
									}
									str = str.slice(0, str.length - 8);
								}
								lib.translate['vl_akain_jh_' + name + '_append'] = append;
								card.skills = ['vl_akain_jh_destroy']
								card.skills.addArray(skills)
							}
						},
        },
        destroy: {
            trigger: {
                player: "loseBegin",
            },
            equipSkill: true,
            forceDie: true,
            charlotte: true,
            forced: true,
            popup: false,
            filter: function (event, player) {
							return event.cards.some(card => card.name.indexOf('vl_akain_jh_') == 0)
						},
            content: function () {
							for (var card of trigger.cards) {
								if (card.name.indexOf('vl_akain_jh_') == 0) {
									card._destroy = true;
									game.log(card, '被放回武将牌堆');
									var name = card.name.slice(7);
									if (lib.character[name]) _status.characterlist.add(name);
								}
							}
						},
            sub: true,
            _priority: -25,
        },
    },
    t: {
        name: "激活",
        info: "你变更势力后(包含开局选势力)，你获得1点魔力。「mpcost」你可以从未登场的5张武将牌中选一张称为“法球”置入你的宝物区。若你的势力为魏，你的“法球”视为「宝物（弃置）」，否则，将你的“法球”视为宝物（伤害牌名）。",
    },
};
