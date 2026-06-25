import { lib, game, ui, get, _status } from '../../../../noname.js';

export function ensureFurryMigrationCompat() {
	if (lib.vlFurryMigrationCompat) return;
	lib.vlFurryMigrationCompat = true;
	window.furry ??= {};
	window.furry.introduce ??= {};

	get.vlIntroduce = function (name, str) {
		if (str) return `<span class="bluetext">${name}</span>`;
		if (lib.vuff && lib.vuff[get.vuffName?.(name, false)]) {
			const intro = get.vuffIntro(name);
			return intro ? `『${intro.name}』` : `『${name}』`;
		}
		return get.poptip ? get.poptip(name) : `「${get.translation(name)}」`;
	};
	get.dialogIntro ??= function (name) {
		if (lib.vuff && lib.vuff[get.vuffName?.(name, false)]) {
			const intro = get.vuffIntro(name);
			return intro ? `『${intro.name}』` : `『${name}』`;
		}
		return get.poptip ? get.poptip(name) : `「${get.translation(name)}」`;
	};
	get.vlAvatarSrc = function (name, flat) {
		if (!name) return null;
		const info = lib.character[name];
		const ext = info?.[4]?.find(item => typeof item === 'string' && item.startsWith('ext:'));
		if (!flat) return ext || `character:${name}`;
		if (ext) return ext.replace(/^ext:/, 'extension/');
		return `extension/瓦尔亚纳/image/character/${name}.jpg`;
	};

	game.getInCenter ??= function () {
		const list = [];
		game.getGlobalHistory('cardMove', function (evt) {
			if (evt.name == 'lose' && evt.position == ui.discardPile) list.addArray(evt.cards);
			else if (evt.name == 'cardsDiscard') list.addArray(evt.cards);
		});
		return list.filterInD('d');
	};

	lib.skill.hubian ??= {
		init(player) {
			player.storage.hubian = false;
		},
		charlotte: true,
		forced: true,
		onremove: true,
		onunmark: true,
		marktext: '互变',
		intro: {
			name: '互变',
			mark(dialog, storage, player) {
				dialog.addText('当前你处于' + (player.storage.hubian ? '圣咏' : '暗涌') + '状态');
			},
		},
	};

	const playerProto = lib.element.player;
	playerProto.vlPrimarySex ??= function () {
		if (this.sex === 'male' || this.sex === 'female') return this.sex;
		const info = get.character(this.name == 'unknown' ? this.name1 : this.name, 4);
		if (info && info.includes('vlPrimarySexFemale')) return 'female';
		return 'male';
	};
	playerProto.chooseText ??= function chooseText(object) {
		const next = game.createEvent('chooseText');
		if (arguments.length == 1 && get.objtype(arguments[0]) == 'object') Object.assign(next, object);
		for (const arg of arguments) {
			if (typeof arg == 'boolean') next.forced = arg;
			else if (Array.isArray(arg)) next.filterText = arg;
			else if (typeof arg == 'function') {
				if (next.ai) next.filterText = arg;
				else next.ai = arg;
			}
			else if (typeof arg == 'string') get.evtprompt(next, arg);
			else if (get.itemtype(arg) == 'dialog') next.dialog = arg;
			else if (typeof arg == 'number') next.max = arg;
		}
		next.forced ??= false;
		next.player = this;
		next.setContent(function () {
			'step 0';
			if (event.isMine()) {
				if (event.dialog) event.dialog.open();
				else {
					event.dialog = ui.create.dialog(event.prompt || '请在下方输入文本');
					if (event.prompt2) event.dialog.addText(event.prompt2, event.prompt2.length <= 20);
				}
				event.result = {};
				const div = document.createElement('div');
				const input = div.appendChild(document.createElement('input'));
				input.style.background = 'black';
				input.style.opacity = '0.6';
				input.style.fontSize = '20px';
				input.style.textAlign = 'center';
				input.style.color = '#c9c8a2';
				input.addEventListener('keydown', e => e.stopPropagation());
				input.addEventListener('keyup', e => e.stopPropagation());
				input.placeholder = '请在此输入文本';
				if (event.max) input.setAttribute('maxlength', event.max);
				event.dialog.add(div);
				game.pause();
				game.countChoose();
				event.choosing = true;
				const doClose = () => {
					button.remove();
					if (cancel) cancel.remove();
					game.resume();
				};
				const button = ui.create.control('确定', () => {
					if (event.filterText) {
						const ok = typeof event.filterText == 'function' ? event.filterText(input.value) : event.filterText.includes(input.value);
						if (!ok) return alert('您输入的内容不符合要求');
					}
					event.result.bool = true;
					event.result.text = input.value || '';
					doClose();
				});
				let cancel;
				if (!event.forced) {
					cancel = ui.create.control('取消', () => {
						event.result.bool = false;
						doClose();
					});
				}
				event.switchToAuto = () => {
					event.result = 'ai';
					doClose();
				};
			}
			else if (event.isOnline()) event.send();
			else event.result = 'ai';
			'step 1';
			if (event.result == 'ai') {
				const value = event.ai ? event.ai(event.getParent(), player) : -1;
				event.result = {};
				event.result.bool = value != -1 || event.forced;
				if (event.result.bool) event.result.text = value;
			}
			_status.imchoosing = false;
			event.choosing = false;
			if (event.dialog) event.dialog.close();
			event.resume();
		});
		next._args = Array.from(arguments);
		next.forceDie = true;
		return next;
	};
	playerProto.chooseButtonControl ??= function (object) {
		const next = game.createEvent('chooseButtonControl');
		next.player = this;
		if (arguments.length == 1 && get.objtype(arguments[0]) == 'object') Object.assign(next, object);
		else for (const arg of arguments) {
			if (get.itemtype(arg) == 'dialog') next.dialog = arg;
			else if (typeof arg == 'number') next.dialog = get.idDialog(arg);
			else if (Array.isArray(arg)) next.createDialog = arg;
			else if (typeof arg == 'boolean') {
				if (next.forced == undefined) next.forced = arg;
				else next.multibutton = arg;
			}
			else if (typeof arg == 'function') {
				if (!next.control) next.control = arg;
				else if (!next.processAI) next.processAI = arg;
				else next.filterButton = arg;
			}
		}
		if (typeof next.dialog == 'number') next.dialog = get.idDialog(next.dialog);
		else if (get.itemtype(next.dialog) == 'dialog') next.closeDialog = true;
		else if (!next.dialog && Array.isArray(next.createDialog)) {
			next.dialog = ui.create.dialog.apply(this, next.createDialog);
			next.closeDialog = true;
		}
		next.forced ??= false;
		next.multibutton ??= false;
		next.control ??= () => 'ok';
		next.filterButton ??= () => true;
		if (next.isMine() == false && next.dialog) next.dialog.style.display = 'none';
		next.setContent(function () {
			'step 0';
			const chooseButton = function (event) {
				event.result ??= {};
				event.forceMine = true;
				event.buttons = [];
				for (const button of event.dialog.buttons) {
					button.classList.add('pointerdiv');
					button.classList.add('selectable');
				}
				event.dialog.open();
				event.custom.replace.button = function (button) {
					if (!event.dialog.contains(button.parentNode) || button.classList.contains('unselectable')) return;
					for (const item of event.dialog.buttons) item.classList.remove('unselectable');
					if (button.classList.contains('selected')) {
						event.buttons.remove(button);
						button.classList.remove('selected');
						for (const item of event.dialog.buttons) {
							if (!event.buttons.includes(item) && !event.filterButton(event.buttons.slice().add(item), item)) item.classList.add('unselectable');
						}
					}
					else {
						event.buttons.add(button);
						button.classList.add('selected');
						for (const item of event.dialog.buttons) {
							if (event.buttons.includes(item)) continue;
							if (!event.multibutton || !event.filterButton(event.buttons.slice().add(item), item)) item.classList.add('unselectable');
						}
					}
					event.controls.replacex();
				};
				event.custom.replace.window = function () {
					event.buttons = [];
					for (const item of event.dialog.buttons) item.classList.remove('selected', 'unselectable');
					event.controls.replacex();
				};
				event.controls = ui.create.control();
				event.controls.replacex = function () {
					let args = event.control(event.buttons);
					const newControls = Array.isArray(args) ? args : args == null ? [] : [args];
					if (event.multibutton) {
						newControls.remove('cancel2');
						if (!event.forced) newControls.add('cancel2');
					}
					else if (!event.forced && !newControls.includes('cancel2') && (!newControls.length || !event.buttons.length)) newControls.add('cancel2');
					this.style.opacity = newControls.length > 0 ? 1 : 0;
					newControls.push(function (control) {
						if (control == 'cancel2') event.result.bool = false;
						else {
							event.result.bool = true;
							event.result.buttons = event.buttons;
							event.result.links = event.buttons.map(button => button.link);
							event.result.control = control;
						}
						event.dialog.close();
						event.controls.close();
						game.resume();
						_status.imchoosing = false;
					});
					return this.replace.apply(this, newControls);
				};
				event.controls.replacex();
				game.pause();
				game.countChoose();
			};
			if (event.isMine()) chooseButton(event);
			else if (event.isOnline()) {
				event.player.send(chooseButton, event);
				event.player.wait();
				game.pause();
			}
			else {
				if (event.dialog && event.closeDialog) event.dialog.close();
				game.resume();
				_status.imchoosing = false;
				if (event.processAI) event.result = event.processAI(event, player);
				else if (!event.forced) event.result = { bool: false };
				else throw "processAI : " + event.getParent().name + "'s chooseButtonControl is forced";
				event.finish();
			}
			'step 1';
			if (event.result.control == 'cancel2') event.finish();
		});
		next._args = Array.from(arguments);
		return next;
	};
	playerProto.changeHubian ??= function () {
		if (!this.hasSkill('hubian')) this.addSkill('hubian');
		this.storage.hubian = !this.storage.hubian;
		this.markSkill('hubian');
		game.broadcastAll(player => player.$changeHubian(), this);
		game.log(this, '改变了其互变状态，当前状态为：', '#g' + (this.storage.hubian ? '圣咏' : '暗涌'));
	};
	playerProto.$changeHubian ??= function () {
		const mark = this.marks.hubian;
		if (mark) mark.firstChild.innerHTML = this.storage.hubian ? '圣咏' : '暗涌';
	};
	playerProto.changeYun ??= function (skill) {
		this[skill] = this[skill] == '平' ? '仄' : '平';
		if (this.getStat('skill')[skill]) delete this.getStat('skill')[skill];
		game.log(this, '#g【', '#g' + get.translation(skill), '#g】', '的韵律转为' + this[skill]);
	};
	playerProto.$changeYun ??= function (skill) {
		const mark = this.marks[skill];
		if (!mark) return;
		mark.firstChild.reversed = !mark.firstChild.reversed;
		mark.firstChild.style.transform = mark.firstChild.reversed ? 'rotate(180deg)' : 'none';
	};
	playerProto.vlShunfajiInit ??= function (skillname) {
		if (!this.isUnderControl(true)) return;
		const info = lib.skill[skillname];
		if (!info?.shunfa) return;
		const button = ui.create.div('.vl-shunfaanniu', this);
		button.innerHTML = get.translation(skillname);
		const player = this;
		button.listen(function () {
			if (!player.hasSkill(skillname, true, true, false)) return button.delete();
			let enable = true;
			if (info.usable && get.skillCount(skillname) >= info.usable) enable = false;
			if (info.round && info.round - (game.roundNumber - player.storage[skillname + '_roundcount']) > 0) enable = false;
			if (info.filter && !info.filter(_status.event, player)) enable = false;
			if (!enable || !player.hasSkill(skillname, false, true, true)) return player.popup('不可发动', 'water', false);
			if (info.clickable) info.clickable(player);
			else player.useSkill(skillname);
		});
	};
	playerProto.vlFenfa ??= function (skillname) {
		const info = lib.skill[skillname];
		if (!info?.fenfa) return;
		info.skillBlocker = function (skill, player) {
			const range = get.select(typeof info.fenfa == 'function' ? info.fenfa(player) : info.fenfa);
			if (range[0] == range[1]) return skill == skillname && player.hp != range[0];
			return skill == skillname && !(player.hp >= range[0] && player.hp <= range[1]);
		};
		info.onremove = function (player, skill) {
			player.removeSkillBlocker(skill);
		};
		this.addSkillBlocker(skillname);
	};
	playerProto.setVlAvatar ??= function (name, name2, video, fakeme) {
		let node;
		if (this.name2 == name) {
			node = this.node.avatar2;
			this.smoothAvatar(true, video);
		}
		else if (this.name1 == name) {
			node = this.node.avatar;
			this.smoothAvatar(false, video);
		}
		if (!node) return;
		node.setBackgroundImage(`extension/福瑞拓展/image/skin/origin-standard/${name2}.jpg`);
		if (this == game.me && ui.fakeme && fakeme !== false) ui.fakeme.style.backgroundImage = node.style.backgroundImage;
		if (video != false) game.addVideo('setVlAvatar', this, [name, name2]);
		game.broadcast((player, name, name2) => player.setVlAvatar(name, name2, false), this, name, name2);
	};
}
