import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "enterGame",
        global: "phaseBefore",
    },
    filter: function (event, player) {
					return event.name != 'phase' || game.phaseNumber == 0;
				},
    forced: true,
    unique: true,
    onremove: function (player) {
					delete player.storage.vl_kulun_zn;
					delete player.storage.vl_kulun_zn_current;
					if (lib.skill.vl_kulun_zn.isSingleElement(player)) {
						game.broadcastAll(function (player) {
							player.name1 = player.name;
							player.smoothAvatar(false);
							player.node.avatar.setBackground(player.name, 'character');
							player.node.name.innerHTML = get.slimName(player.name);
							delete player.name2;
							player.classList.remove('fullskin2');
							player.node.avatar2.classList.add('hidden');
							player.node.name2.innerHTML = '';
							if (player == game.me && ui.fakeme) {
								ui.fakeme.style.backgroundImage = player.node.avatar.style.backgroundImage;
							}
						}, player);
					}
				},
    element: [
        ["vl_kulun_light", "vl_kulun_light_sg", "vl_kulun_light_yb"],
        ["vl_kulun_dark", "vl_kulun_dark_as", "vl_kulun_dark_yb"],
        ["vl_kulun_wind", "vl_kulun_wind_wx", "vl_kulun_wind_cm"],
        ["vl_kulun_fire", "vl_kulun_fire_ly", "vl_kulun_fire_fz"],
        ["vl_kulun_water", "vl_kulun_water_sy", "vl_kulun_water_jy"],
        ["vl_kulun_ice", "vl_kulun_ice_hs", "vl_kulun_ice_dj"],
        ["vl_kulun_thunder", "vl_kulun_thunder_yl", "vl_kulun_thunder_dl"],
        ["vl_kulun_nature", "vl_kulun_nature_hc", "vl_kulun_nature_tw"],
        ["vl_kulun_dirt", "vl_kulun_dirt_zw", "vl_kulun_dirt_zj"],
        ["vl_kulun_metal", "vl_kulun_metal_zl", "vl_kulun_metal_rh"],
    ],
    conflictMap: function () {
					if (!_status.elementMap) {
						_status.elementMap = {
							vl_kulun_light: ['vl_kulun_dark'],
							vl_kulun_dark: ['vl_kulun_light', ' vl_kulun_thunder'],
							vl_kulun_wind: ['vl_kulun_nature'],
							vl_kulun_fire: ['vl_kulun_ice', 'vl_kulun_water'],
							vl_kulun_water: ['vl_kulun_fire'],
							vl_kulun_ice: ['vl_kulun_fire'],
							vl_kulun_thunder: [],
							vl_kulun_nature: ['vl_kulun_metal', 'vl_kulun_fire'],
							vl_kulun_dirt: [],
							vl_kulun_metal: [],
						};
					}
					return _status.elementMap;
				},
    group: "vl_kulun_zn_back",
    content: function () {
					'step 0'
					var list = lib.skill.vl_kulun_zn.element.map(i => i[0]);
					player.markAuto('vl_kulun_zn', list);
					game.broadcastAll(function (player, list) {
						var cards = [];
						for (var i = 0; i < list.length; i++) {
							var cardname = 'huashen_card_' + list[i];
							var url = 'ext:福瑞拓展/image/skin/origin-standard/'
							lib.card[cardname] = {
								fullimage: true,
								image: url + list[i] + '.jpg'
							}
							lib.translate[cardname] = get.rawName2(list[i]);
							cards.push(game.createCard(cardname, '', ''));
						}
						player.$gain2(cards, 'nobroadcast');
					}, player, list);
					'step 1'
					var next = game.createEvent('vl_kulun_zn_clique');
					next.player = player;
					next.num = 1
					next.setContent(lib.skill.vl_kulun_zn.contentx);
					player.draw(2)
				},
    contentx: function () {
					'step 0'
					var list = player.getStorage('vl_kulun_zn').slice();
					var others = list.randomGets(event.num);
					if (others.length == 1) {
						event._result = {
							bool: true,
							links: others
						};
					} else {
						var conflictList = others.filter(element => {
							var map = lib.skill.vl_kulun_zn.conflictMap();
							var names = map[player.name1];
							return names.includes(element);
						}), filter = others.slice()
						filter.remove(...conflictList);
						player.chooseButton([
							'注能：请选择注入的能量',
							[others, 'character']
						], true).set('filterButton', button => {
							return _status.event.canChoose.includes(button.link);
						}).set('canChoose', filter).set('ai', button => {
							var map = {
								'dark': 'ice',
								'dirt': 'dark',
								'metal': 'light',
								'ice': 'water',
								'thunder': 'metal',
								'water': 'nature',
								'nature': 'thunder',
								'light': 'fire',
								'fire': 'wind',
								'wind': 'dirt',
							}
							return button.link.slice(9) == map[player.name1.slice(9)] ? 10 : 10 * Math.random()
						});
					}
					'step 1'
					if (result.bool) {
						var choice = result.links[0]
						if (!player.storage.vl_kulun_zn_current) player.storage.vl_kulun_zn_current = []
						if (player.name1 == player.name) {
							player.storage.vl_kulun_zn_current[0] = choice
							game.broadcastAll(function (player, choice) {
								player.name1 = choice;
								player.node.avatar.setBackground(choice, 'character');
								player.node.name.innerHTML = get.slimName(choice);
								if (player == game.me && ui.fakeme) {
									ui.fakeme.style.backgroundImage = player.node.avatar.style.backgroundImage;
								}
							}, player, choice)
						} else {
							player.storage.vl_kulun_zn_current[1] = choice
							game.broadcastAll(function (player, choice) {
								player.name2 = choice;
								player.classList.add('fullskin2');
								player.node.avatar2.classList.remove('hidden');
								player.node.avatar2.setBackground(choice, 'character');
								player.node.name2.innerHTML = get.slimName(choice);
							}, player, choice);
						}
						player.unmarkAuto('vl_kulun_zn', [choice]);
						var skills = lib.skill.vl_kulun_zn.element.filter(i => i[0] == player.name1 || i[0] == choice).map(i => i.slice(1)).reduce((acc, val) => acc.concat(val, []))
						var tips = lib.skill.vl_kulun_zn.element.find(i => i[0] == choice).slice(1)
						game.log(player, '选择了元素', '#y' + get.translation(choice));
						if (skills.length) {
							var str = '';
							for (var i of tips) {
								str += '【' + get.translation(i) + '】、';
								player.popup(i);
							}
							player.addAdditionalSkill('vl_kulun_zn', skills);
							str = str.slice(0, -1);
							game.log(player, '获得了技能', '#g' + str);
						}
					}
				},
    isSingleElement: function (player) {
					var map = lib.skill.vl_kulun_zn.conflictMap();
					return player.name == 'vl_kulun' && (map[player.name1] && map[player.name2] || map[player.name1] && !player.name2 || !player.name1 && !player.name2 || player.name == player.name1 && !player.name2);
				},
    mod: {
        aiValue: function (player, card, num) {
						if (['shan', 'tao', 'wuxie', 'caochuan'].includes(card.name)) return num / 10;
					},
        aiUseful: function () {
						return lib.skill.vl_kulun_zn.mod.aiValue.apply(this, arguments);
					},
    },
    ai: {
        combo: "vl_kulun_fs",
        nokeep: true,
    },
    intro: {
        mark: function (dialog, storage, player) {
						dialog.addText('剩余元素');
						dialog.addSmall([storage, 'character']);
						if (player.storage.vl_kulun_zn_current && player.isIn()) {
							dialog.addText('当前元素');
							dialog.addSmall([player.storage.vl_kulun_zn_current, 'character']);
						}
					},
    },
    subSkill: {
        back: {
            trigger: {
                global: "restEnd",
            },
            filter: function (event, player) {
							return event.getTrigger().player == player;
						},
            forced: true,
            content: function () {
							'step 0'
							delete player.storage.vl_kulun_zn_current;
							if (lib.skill.vl_kulun_zn.isSingleElement(player)) {
								game.broadcastAll(function (player) {
									player.name1 = player.name;
									player.smoothAvatar(false);
									player.node.avatar.setBackground(player.name, 'character');
									player.node.name.innerHTML = get.slimName(player.name);
									delete player.name2;
									player.classList.remove('fullskin2');
									player.node.avatar2.classList.add('hidden');
									player.node.name2.innerHTML = '';
									if (player == game.me && ui.fakeme) {
										ui.fakeme.style.backgroundImage = player.node.avatar.style.backgroundImage;
									}
								}, player);
							}
							'step 1'
							var next = game.createEvent('vl_kulun_zn_clique');
							next.player = player;
							next.num = 1
							next.setContent(lib.skill.vl_kulun_zn.contentx);
							player.draw(2)
						},
            sub: true,
            _priority: 0,
        },
    },
    _priority: 0,
    t: {
        name: "注能",
        info: "锁定技。①游戏开始时，你获得十张“元素能量”牌。②游戏开始时或当你休整结束后，系统随机选择一张“元素能量”并“「zhuru」”，然后摸两张牌。③若你有亮出的“元素能量”牌，你视为拥有此牌上的技能。",
    },
};
