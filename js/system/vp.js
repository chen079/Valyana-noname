import { lib, game, ui, get } from '../../../../noname.js';

//-----------------------------灵能-------------------------------//
export function initVpSystem() {
	const ensureVpProperty = function (player) {
		if (player.Vp === undefined) game.defineVpProperty(player);
	};
	const updateVpBar = function (player) {
		game.createVpBar(player);
		const button = player.node.Vp;
		if (!button) return;
		button.innerHTML = player.Vp + '/' + player.maxVp;
		if (player.maxVp > 0) {
			player.node.Vp.show();
			player.node.VpIcon.show();
		} else {
			player.node.Vp.hide();
			player.node.VpIcon.hide();
		}
	};
	const vlplayer = {
		changeVp: function (num) {
			ensureVpProperty(this);
			const next = game.createEvent('changeVp');
			next.num = num;
			next.player = this;
			next.originalVp = this.Vp;
			next.originalMaxVp = this.maxVp;
			next.setContent('changeVp');
			return next;
		},
		loseVp: function (num) {
			ensureVpProperty(this);
			const next = game.createEvent('loseVp');
			next.num = num ?? 1;
			next.player = this;
			next.filterStop = function () {
				if (this.num <= 0 || this.player.isVpDisabled()) {
					delete this.filterStop;
					this.finish();
					this._triggered = null;
					return true;
				}
			};
			next.setContent('loseVp');
			return next;
		},
		gainVp: function (num) {
			ensureVpProperty(this);
			const next = game.createEvent('gainVp');
			next.num = num ?? 1;
			next.player = this;
			next.filterStop = function () {
				if (this.num <= 0 || this.player.isVpDisabled() || this.player.Vp >= this.player.maxVp) {
					delete this.filterStop;
					this.finish();
					this._triggered = null;
					return true;
				}
			};
			next.setContent('gainVp');
			return next;
		},
		consumeVp: function (num) {
			ensureVpProperty(this);
			const next = game.createEvent('consumeVp');
			next.num = num ?? 1;
			next.player = this;
			next.filterStop = function () {
				if (this.num <= 0 || this.player.isVpDisabled()) {
					delete this.filterStop;
					this.finish();
					this._triggered = null;
					return true;
				}
			};
			next.setContent('consumeVp');
			return next;
		},
		changeMaxVp: function (num) {
			ensureVpProperty(this);
			const next = game.createEvent('changeMaxVp');
			next.num = num;
			next.player = this;
			next.originalVp = this.Vp;
			next.originalMaxVp = this.maxVp;
			next.setContent('changeMaxVp');
			return next;
		},
		loseMaxVp: function (num) {
			ensureVpProperty(this);
			const next = game.createEvent('loseMaxVp');
			next.num = num ?? 1;
			next.player = this;
			next.filterStop = function () {
				if (this.num <= 0 || this.player.isVpDisabled()) {
					delete this.filterStop;
					this.finish();
					this._triggered = null;
					return true;
				}
			};
			next.setContent('loseMaxVp');
			return next;
		},
		gainMaxVp: function (num) {
			ensureVpProperty(this);
			const next = game.createEvent('gainMaxVp');
			next.num = num ?? 1;
			next.player = this;
			next.filterStop = function () {
				if (this.num <= 0 || this.player.isVpDisabled()) {
					delete this.filterStop;
					this.finish();
					this._triggered = null;
					return true;
				}
			};
			next.setContent('gainMaxVp');
			return next;
		},
		disableVp: function () {
			this.setStorage('Vp', 0);
			this.setStorage('maxVp', 0);
			this.setStorage('VpDisabled', true);
			updateVpBar(this);
		},
		isVpEnabled: function () {
			return !this.getStorage('VpDisabled', false);
		},
		isVpDisabled: function () {
			return this.getStorage('VpDisabled', false);
		},
	};
	const vlgame = {
		defineVpProperty: function (player) {
			// 1. 获取实际角色名（处理双将时 player.name 无效的情况）
			const getCharName = (slot) => {
				if (slot === 1) {
					// 优先用 player.name，若无效则用 player.name1
					if (lib.character[player.name]) return player.name;
					if (player.name1 && lib.character[player.name1]) return player.name1;
					return null;
				} else {
					// 第二个角色只用 player.name2
					if (lib.character[player.name2]) return player.name2;
					return null;
				}
			};

			// 2. 解析单个角色的 Vp（修复了 当前>上限 时覆盖上限的 Bug）
			const parseVp = (name) => {
				if (!name) return { max: 0, cur: 0 };
				const char = lib.character[name];
				if (!char) return { max: 0, cur: 0 };

				const vpEntry = char[4]?.find(str => str.includes('Vp'));
				if (!vpEntry) {
					// 无 Vp 标记时，上限取 maxHp（最大5），当前取一半
					const max = Math.min(player.maxHp, 5);
					return { max, cur: Math.floor(max / 2) };
				}

				const parts = vpEntry.replace('Vp:', '').split('/').map(Number);
				if (parts.length === 1) {
					const max = parts[0];
					return { max, cur: Math.floor(max / 2) };
				}

				// 修复：明确 cur 为第一个数，max 为第二个数，若 cur > max 则截断 cur
				let cur = parts[0];
				let max = parts[1];
				if (cur > max) cur = max;  // 这就是原始代码想实现但写错了的逻辑
				return { max, cur };
			};

			// 3. 获取两个角色的数据
			const data1 = parseVp(getCharName(1));
			const data2 = parseVp(getCharName(2));

			// 4. 合并平均值（存在则取平均，否则取存在的那个）
			const has1 = data1.max > 0;
			const has2 = data2.max > 0;

			const maxVp = has1 && has2 ? Math.floor((data1.max + data2.max) / 2)
				: has1 ? data1.max
					: has2 ? data2.max
						: 0;

			const curVp = has1 && has2 ? Math.floor((data1.cur + data2.cur) / 2)
				: has1 ? data1.cur
					: has2 ? data2.cur
						: 0;

			player.setStorage('maxVp', maxVp);
			player.setStorage('Vp', curVp);

			// 5. UI 更新函数
			const updateBar = () => updateVpBar(player);

			// 6. Setter 映射（保留原有行为：若方法不存在则直接报错，不加 ?. 以保持严格一致）
			const vpActions = {
				gain: (val) => player.gainVp(val),
				lose: (val) => player.loseVp(val),
				consume: (val) => player.consumeVp(val),
			};
			const maxVpActions = {
				gain: (val) => player.gainMaxVp(val),
				lose: (val) => player.loseMaxVp(val),
			};

			Object.defineProperty(player, 'Vp', {
				get: () => player.getStorage('Vp', 0),
				set(value) {
					if (typeof value === 'number') {
						player.setStorage('Vp', value);
						updateBar();
						return;
					}
					if (!Array.isArray(value) || typeof value[0] !== 'number') throw 'value类型错误';
					const [num, mode] = value;
					if (mode && vpActions[mode]) {
						vpActions[mode](num);
					} else {
						player.setStorage('Vp', num);
						updateBar();
					}
				},
				enumerable: true,
				configurable: true,
			});

			Object.defineProperty(player, 'maxVp', {
				get: () => player.getStorage('maxVp', 0),
				set(value) {
					if (typeof value === 'number') {
						player.setStorage('maxVp', value);
						updateBar();
						return;
					}
					if (!Array.isArray(value) || typeof value[0] !== 'number') throw 'value[0]类型错误';
					const [num, mode] = value;
					if (mode && maxVpActions[mode]) {
						maxVpActions[mode](num);
					} else {
						player.setStorage('maxVp', num);
						updateBar();
					}
				},
				enumerable: true,
				configurable: true,
			});
		},
		getVpBarStyle: function () {
			let loc = lib.config.VpBarLocation;
			if (!loc) {
				loc = 'shangcenei';
			}
			return {
				button: '.vp-' + loc,
				name: '.name-' + loc,
			};
		},
		createVpBar: function (player) {
			let button;
			if (!player.node) {
				player.node = {};
			}
			let style = game.getVpBarStyle();
			if (!player.node.VpIcon) {
				button = ui.create.div(style.button);
			} else {
				button = player.node.VpIcon;
			}
			button.hide();
			player.appendChild(button);
			button.show();
			let button2;
			if (!player.node.Vp) {
				button2 = ui.create.div(style.name, button);
				button2.classList.add('text');
			} else {
				button2 = player.node.Vp;
			}
			player.node.Vp = button2;
			player.node.VpIcon = button;
			if (player.Vp === undefined) {
				game.defineVpProperty(player);
			}
			button2.innerHTML = player.Vp + '/' + player.maxVp;
			if (player.maxVp <= 0) {
				player.node.VpIcon.hide();
				player.node.Vp.hide();
			}
			player.isShowVp = true
		},
	};
	const vlcontent = {
		async changeVp(event, trigger, player) {
			let { num } = event;
			updateVpBar(player);
			if (!num) {
				event.changedVp = 0;
				return;
			}
			player.setStorage('Vp', player.getStorage('Vp', 0) + num);
			if (isNaN(player.getStorage('Vp', 0)) || player.getStorage('Vp', 0) < 0) player.setStorage('Vp', 0);
			if (player.getStorage('Vp', 0) > player.getStorage('maxVp', 0)) player.setStorage('Vp', player.getStorage('maxVp', 0));
			updateVpBar(player);
			event.originalMaxVp = player.maxVp;
			event.changedMaxVp = 0;
			event.changedVp = player.Vp - Math.max(0, event.originalVp);
			await event.trigger('changeVp');
		},
		async loseVp(event, trigger, player) {
			let { num } = event;
			if (num > player.Vp) {
				num = player.Vp;
				event.num = num;
			}
			if (num > 0) {
				game.log(player, '失去了' + get.cnNumber(num) + '点灵能');
				await player.changeVp(-num);
			} else {
				event._triggered = null;
			}
		},
		async gainVp(event, trigger, player) {
			let { num } = event;
			if (num > player.maxVp - player.Vp) {
				num = player.maxVp - player.Vp;
				event.num = num;
			}
			if (num > 0) {
				if (lib.vpStory?.playVpAudio) lib.vpStory.playVpAudio('vprec_audio');
				game.log(player, '获得了' + get.cnNumber(num) + '点灵能');
				await player.changeVp(num);
			} else {
				event._triggered = null;
			}
		},
		async consumeVp(event, trigger, player) {
			let { num } = event;
			await event.trigger('consumeVpBegin1');
			if (num < 0) {
				num = 0;
				event.num = num;
				await event.trigger('consumeVpToZero');
			}
			if (num > player.Vp) {
				num = player.Vp;
				event.num = num;
			}
			await event.trigger('consumeVpBegin2');
			if (num > 0) {
				game.log(player, '消耗了' + get.cnNumber(num) + '点灵能');
				await player.changeVp(-num);
				if (event.vpAnim !== false && game.vpPlayAnimOnPlayer) game.vpPlayAnimOnPlayer('vp_consume', player);
			} else {
				event._triggered = null;
			}
		},
		async changeMaxVp(event, trigger, player) {
			let { num } = event;
			updateVpBar(player);
			player.setStorage('maxVp', player.getStorage('maxVp', 0) + num);
			if (isNaN(player.getStorage('maxVp', 0)) || player.getStorage('maxVp', 0) < 0) player.setStorage('maxVp', 0);
			event.changedMaxVp = player.maxVp - event.originalMaxVp;
			if (player.getStorage('Vp', 0) > player.getStorage('maxVp', 0)) {
				await player.changeVp(player.getStorage('maxVp', 0) - player.getStorage('Vp', 0));
			}
			updateVpBar(player);
			event.changedVp = player.Vp - Math.max(0, event.originalVp);
			await event.trigger('changeMaxVp');
		},
		async loseMaxVp(event, trigger, player) {
			let { num } = event;
			if (num > player.maxVp) {
				num = player.maxVp;
				event.num = num;
			}
			if (num > 0) {
				game.log(player, '失去了' + get.cnNumber(num) + '点灵能上限');
				await player.changeMaxVp(-num);
			} else {
				event._triggered = null;
			}
		},
		async gainMaxVp(event, trigger, player) {
			const { num } = event;
			if (num > 0) {
				game.log(player, '获得了' + get.cnNumber(num) + '点灵能上限');
				await player.changeMaxVp(num);
			} else {
				event._triggered = null;
			}
		},
	}
	const vlskills = {
		_Vp: {
			trigger: {
				global: ['roundStart', 'gameStart'],
				player: 'phaseBefore',
			},
			forced: true,
			direct: true,
			unique: true,
			charlotte: true,
			locked: true,
			filter(event, player) {
				return !player.isShowVp && player.getSkills(true).some(skill => lib.skill[skill].vpSkill);
			},
			content() {
				game.createVpBar(player);
			},
		}
	}
	Object.assign(lib.element.content, vlcontent);
	Object.assign(lib.skill, vlskills)
	Object.assign(lib.element.player, vlplayer);
	Object.assign(game, vlgame);
}
