import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

const card = {
	image: 'ext:瓦尔亚纳/image/card/vl_equip5_wxpp.png',
	fullskin: true,
	type: 'equip',
	subtype: 'equip5',
	skills: ['vl_wxpp_skill'],
	ai: {
		equipValue: 7,
		basic: {
			order(card, player) {
				if (player && player.hasSkillTag('reverseEquip')) return 8.5 - get.equipValue(card, player) / 20;
				return 8 + get.equipValue(card, player) / 20;
			},
			useful: 3,
			equipValue: 3,
			value(card, player, index, method) {
				if (player.isDisabled(get.subtype(card))) return 0.01;
				let value = 0;
				const info = get.info(card);
				const current = player.getEquip(info.subtype);
				if (current && card != current) value = get.value(current, player);
				let equipValue = info.ai.equipValue;
				if (equipValue == undefined) equipValue = info.ai.basic.equipValue;
				if (typeof equipValue == 'function') {
					if (method == 'raw') return equipValue(card, player);
					if (method == 'raw2') return equipValue(card, player) - value;
					return Math.max(0.1, equipValue(card, player) - value);
				}
				if (typeof equipValue != 'number') equipValue = 0;
				if (method == 'raw') return equipValue;
				if (method == 'raw2') return equipValue - value;
				return Math.max(0.1, equipValue - value);
			},
		},
		result: {
			target(player, target, card) {
				return get.equipResult(player, target, card.name);
			},
		},
	},
};

const skill = {
	vl_wxpp_skill: {
		audio: 'ext:瓦尔亚纳/audio/card:1',
		enable: 'phaseUse',
		equipSkill: true,
		direct: true,
		mark: true,
		firstDo: true,
		marktext: '忘弦',
		intro: {
			name: '忘弦琵琶',
			markcount(storage, player) {
				const voice = ['宫', '商', '角', '徵', '羽'];
				return voice[player.getStorage('vl_wxpp_skill', 0) - 1];
			},
			mark(dialog, storage, player) {
				const num = player.getStorage('vl_wxpp_skill', 0);
				if (!num) return;
				const str = ['摸牌阶段，你多摸两张牌', '出牌阶段，你可以额外使用一张【杀】', '你跳过你的下个弃牌阶段', '结束阶段，你摸两张牌', '回合结束时，你令一名其他角色技能失效直到其回合结束。'];
				dialog.addText(str[num - 1]);
			},
		},
		music: {
			1155665: '一闪一闪亮晶晶～',
			11556654433221: '满天都是小星星～',
			114514: '你是一个一个一个......',
			3345: '欢～乐～女～神～',
			33455432: '圣～洁～美～丽～',
			334554321123: '灿～烂～光～芒～',
			334554321123322: '照～～～大～地～',
		},
		music_achieve: ['11556654433221', '334554321123322'],
		content() {
			'step 0'
			event.index = [];
			'step 1'
			player.chooseControl('宫', '商', '角', '清角', '徵', '羽', '变宫', 'cancel2').set('ai', () => 'cancel2');
			'step 2'
			event.index.push(result.index + 1);
			switch (result.control) {
				case '宫':
					lib.frStory?.playfrAudio?.('gong');
					break;
				case '商':
					lib.frStory?.playfrAudio?.('shang');
					break;
				case '角':
					lib.frStory?.playfrAudio?.('jue');
					break;
				case '清角':
					lib.frStory?.playfrAudio?.('qingjue');
					break;
				case '徵':
					lib.frStory?.playfrAudio?.('zhi');
					break;
				case '羽':
					lib.frStory?.playfrAudio?.('yu');
					break;
				case '变宫':
					lib.frStory?.playfrAudio?.('biangong');
					break;
				default:
					event.finish();
			}
			'step 3'
			for (const i in lib.skill.vl_wxpp_skill.music) {
				if (event.index.join('').lastIndexOf(i) === Math.max(event.index.length - i.length, 0)) {
					player.$fullscreenpop(lib.skill.vl_wxpp_skill.music[i], 'soil', false, true);
					if (lib.skill.vl_wxpp_skill.music_achieve.includes(i) && game.frAchi && !game.frAchi.hasAchi('你会弹琴吗？', 'special')) {
						game.frAchi.addProgress('你会弹琴吗？', 'special');
					}
				}
			}
			event.goto(1);
		},
		group: 'vl_wxpp_skill_wxpp',
		subSkill: {
			wxpp: {
				trigger: {
					player: 'phaseBegin',
				},
				direct: true,
				charlotte: true,
				content() {
					'step 0'
					const voice = ['宫声', '商声', '角声', '徵声', '羽声'];
					const num = Math.floor(5 * Math.random()) + 1;
					player.setStorage('vl_wxpp_skill', num);
					player.markSkill('vl_wxpp_skill');
					game.log(player, '获得了', '#g' + voice[num - 1], '的效果');
					if (num == 1) {
						lib.frStory?.playfrAudio?.('gong');
						player.addTempSkill('vl_wxpp_skill_gong');
					} else if (num == 2) {
						lib.frStory?.playfrAudio?.('shang');
						player.addTempSkill('vl_wxpp_skill_shang');
					} else if (num == 3) {
						lib.frStory?.playfrAudio?.('jue');
						player.addTempSkill('vl_wxpp_skill_jue');
					} else if (num == 4) {
						lib.frStory?.playfrAudio?.('zhi');
						player.addTempSkill('vl_wxpp_skill_zhi');
					} else if (num == 5) {
						lib.frStory?.playfrAudio?.('yu');
						player.addTempSkill('vl_wxpp_skill_yu');
					}
				},
			},
			gong: {
				trigger: {
					player: 'phaseDrawBegin2',
				},
				charlotte: true,
				equipSkill: true,
				direct: true,
				filter(event, player) {
					return !event.numFixed;
				},
				onremove(player) {
					player.unmarkSkill('vl_wxpp_skill');
				},
				content() {
					trigger.num += 2;
				},
				ai: {
					threaten: 1.3,
				},
			},
			shang: {
				charlotte: true,
				equipSkill: true,
				onremove(player) {
					player.unmarkSkill('vl_wxpp_skill');
				},
				mod: {
					cardUsable(card, player, num) {
						if (card.name == 'sha') return num + 1;
					},
				},
			},
			jue: {
				charlotte: true,
				equipSkill: true,
				trigger: {
					player: 'phaseDiscardBefore',
				},
				onremove(player) {
					player.unmarkSkill('vl_wxpp_skill');
				},
				direct: true,
				content() {
					trigger.cancel();
				},
			},
			zhi: {
				charlotte: true,
				equipSkill: true,
				trigger: {
					player: 'phaseJieshuBegin',
				},
				onremove(player) {
					player.unmarkSkill('vl_wxpp_skill');
				},
				frequent: true,
				content() {
					player.draw(2);
				},
			},
			yu: {
				charlotte: true,
				equipSkill: true,
				trigger: {
					player: 'phaseEnd',
				},
				onremove(player) {
					player.unmarkSkill('vl_wxpp_skill');
				},
				direct: true,
				content() {
					'step 0'
					player.chooseTarget('是否令一名角色的技能失效直到其回合结束', function (card, player, target) {
						return target != player && !target.hasSkill('vl_wxpp_skill_baiban');
					}).set('ai', function (target) {
						const player = _status.event.player;
						return -get.attitude(player, target);
					});
					'step 1'
					if (result.bool) result.targets[0].addTempSkill('vl_wxpp_skill_baiban', { player: 'phaseEnd' });
				},
			},
			baiban: {
				init(player, skill) {
					player.addSkillBlocker(skill);
					player.addTip(skill, '羽声  技能失效');
				},
				onremove(player, skill) {
					player.removeSkillBlocker(skill);
					player.removeTip(skill);
				},
				inherit: 'baiban',
				marktext: '羽',
			},
		},
	},
};

const translate = {
	vl_equip5_wxpp: '忘弦琵琶',
	vl_equip5_wxpp_info: `出牌阶段，你可以演奏忘弦琵琶。回合开始时，你随机获得${get.poptip('wuyin')}的效果之一直到回合结束。`,
	vl_wxpp_skill: '演奏',
	vl_wxpp_skill_info: `出牌阶段，你可以演奏忘弦琵琶。回合开始时，你随机获得${get.poptip('wuyin')}的效果之一直到回合结束。`,
	'#ext:瓦尔亚纳/audio/card/vl_wxpp_skill1': '点击播放忘弦琵琶音频',
};

const list = [['diamond', 1, 'vl_equip5_wxpp']];

export default {
	card: {
		vl_equip5_wxpp: card,
	},
	skill,
	translate,
	list,
};
