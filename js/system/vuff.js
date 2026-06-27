import { lib, game, ui, get } from '../../../../noname.js';

export function initVuffSystem(vuffs) {
    const vlget = {
        randomPercent: function (probability) {
            if (probability > 1) {
                console.log('请输入小于等于1的小数')
            } else if (probability < 0) {
                console.log('请输入大于等于0的小数')
            }
            // 生成一个介于 0 到 1 之间的随机数
            const randomValue = Math.random();

            // 如果随机数小于等于概率值，则返回 true，否则返回 false
            return randomValue <= probability;
        },
        vuffLimit: function (buff) {
            return get.vuffInfo(buff, 'limit')
        },
        isVuffNatualLose: function (buff) {
            return get.vuffInfo(buff, 'naturalLose')
        },
        vuffType: function (buff) {
            if (!get.vuffInfo(buff, 'type')) return 'none'
            return get.vuffInfo(buff, 'type')
        },
        deepClone: function (obj, newObj) {
            newObj = newObj || {};
            for (let key in obj) {
                if (typeof obj[key] == 'object') {
                    newObj[key] = (obj[key].constructor === Array) ? [] : {}
                    vlget.deepClone(obj[key], newObj[key]);
                } else {
                    newObj[key] = obj[key]
                }
            }
            return newObj;
        },
        vuffContent: function (name) {
            const info = lib.vuff[name].vuffInfo
            let str = ''
            if (info.naturalLose) {
                str += '<li>自然衰减：<b>是</b>'
            } else {
                str += '<li>自然衰减：<b>否</b>'
            }
            if (info.type == 'vuff') {
                str += '<li>类型：增益'
            } else if (info.type == 'devuff') {
                str += '<li>类型：减益'
            } else if (info.type == 'none') {
                str += '<li>类型：中立'
            }
            if (info.limit) {
                str += '<li>上限：' + info.limit
            } else {
                str += '<li>无上限'
            }
            if (info.vuffReject) {
                const buffname = info.vuffReject.map(function (i) {
                    return '「' + lib.vuff[i].intro.name + '」'
                })
                str += '<li>冲突灵态：' + buffname.join('、')
            }
            return str
        },
        vuffs: function (filter) {
            if (typeof filter == 'function') return Object.keys(lib.vuff).filter(i => filter(i))
            else return Object.keys(lib.vuff)
        },
        vuffName: function (name, iscomplete) {
            if (typeof name != 'string') return;
            let vuff = name;
            if (vuff.indexOf('_') == 0) vuff = vuff.slice(1);
            if (iscomplete !== false) {
                if (vuff.indexOf('vuff_') == -1) vuff = 'vuff_' + vuff;
            } else {
                if (vuff.indexOf('vuff_') == 0) vuff = vuff.replace('vuff_', '');
            }
            return vuff;
        },
        vuffListDialog: function () {
            const caption = '灵态清单';
            const dialog = ui.create.dialog(caption, 'hidden');
            dialog.style.fontFamily = 'shousha'
            dialog.style.fontSize = '30px'
            const exit = ui.create.div('.exit', dialog);
            dialog.classList.add('static');
            dialog.classList.add('vuffList');
            dialog.classList.remove('hidden');
            ui.window.appendChild(dialog);
            exit.onclick = function () {
                dialog.remove();
            }
            const create = function (buff) {
                // 创建一个包含图片的 <div> 元素
                const container = document.createElement('div')
                container.style.borderBottom = '1px solid transparent'
                container.style.width = '100%'
                container.style.borderImage = 'linear-gradient(to left, rgb(255 255 255 / 0%), rgb(255, 255, 255), rgb(255 255 255 / 0%)) 0.5 / 1 / 0 stretch'
                dialog.content.appendChild(container)
                const name = document.createElement('div')
                name.style.position = 'relative'
                name.style.fontSize = '20px'
                name.innerHTML = get.vuffIntro(buff).name
                container.appendChild(name)
                const imageDiv = document.createElement('div');
                imageDiv.classList.add('image-container'); // 可以定义一个样式类来设置该 div 的样式
                const img = document.createElement('img');
                img.src = lib.assetURL + 'extension/瓦尔亚纳/image/vuff/' + buff + '.png'
                img.classList.add('square-image'); // 可以定义一个样式类来设置图片的样式
                container.appendChild(imageDiv)
                imageDiv.appendChild(img);
                const h3 = document.createElement('h3');
                const str = get.vuffIntro(buff).content;
                h3.innerHTML = str;
                h3.style.textAlign = 'left'
                h3.style.marginLeft = '5%'
                container.appendChild(h3)
            }

            for (let i in lib.vuff) {
                create(i);
            }
        },
        vuffIntro: function (name) {
            name = get.vuffName(name, false)
            return lib.vuff[name].intro
        },
        vuffNum: function () {
            let player;
            let vuff;
            for (let i = 0; i < arguments.length; i++) {
                if (get.itemtype(arguments[i]) == 'player') {
                    player = arguments[i]
                } else {
                    vuff = get.vuffName(arguments[i]);
                }
            }
            if (!player.storage[vuff] || player.storage[vuff] < 0) return 0;
            return player.storage[vuff];
        },
        vuffRank: function (player, name, income, plies) {
            if (player.isImmVuff(name)) return 0
            name = get.vuffName(name, false);
            const vuff = get.vuffName(name);
            const list = [lib.skill[vuff].vuffInfo.vuffRank];
            player.getSkills(null, false, false).filter(function (i) {
                if (lib.skill[i] && lib.skill[i].ai && lib.skill[i].ai.vuffRank_extra &&
                    lib.skill[i].ai.vuffRank_extra[name]) {
                    list.push(lib.skill[i].ai.vuffRank_extra[name]);
                }
            });
            if (!plies || typeof plies != 'number') {
                if (income && typeof income == 'number') plies = income;
                else plies = get.vuffNum(player, vuff);
            }
            let num = 0;
            for (let i = 0; i < list.length; i++) {
                const rank = list[i];
                if (list[i].immunity === true) {
                    return 0;
                }
                if (income !== false) {
                    if (rank.basic) num += rank.basic[0];
                    if (rank.add) num += rank.add[0] * plies;
                    let random2 = 1;
                    if (rank.randomPower) {
                        if (Array.isArray(rank.randomPower)) random2 = rank.randomPower[0];
                        else random2 = rank.randomPower;
                    }
                    if (rank.random) num += Math.min(1, rank.random[0] * plies) * random2;
                }
                if (income !== true) {
                    if (rank.basic) num -= rank.basic[1];
                    if (rank.add) num -= rank.add[1] * plies;
                    let random2 = 1;
                    if (rank.randomPower) {
                        if (Array.isArray(rank.randomPower)) random2 = rank.randomPower[1];
                        else random2 = rank.randomPower;
                    }
                    if (rank.random) num -= Math.min(1, rank.random[1] * plies) * random2;
                }
            }
            if (income === false) return -num;
            return num;
        },
        vuffList: function (player, filter) {
            const list = [];
            for (let i in lib.vuff) {
                const vuff = get.vuffName(i);
                if (get.vuffNum(player, vuff) == 0) continue;
                if (filter && typeof filter == 'function') {
                    if (filter(player, vuff) == true) list.push(vuff);
                    continue;
                } else if (typeof filter == 'string') {
                    if (get.vuffInfo(i, 'type') == filter) list.push(vuff);
                    continue
                }
                list.push(vuff);
            }
            return list;
        },
        vuffInfo: function (name, filter) {
            const vuff = get.vuffName(name, false);
            let info;
            if (lib.vuff[vuff]) info = lib.vuff[vuff].vuffInfo;
            else return null;
            if (!filter) return info;
            if (filter == 'vuffReject') {
                if (!info.vuffReject) return [];
            } else if (filter == 'limit') {
                if (!info.limit) return Infinity;
            }
            return info[filter];
        },
    };
    const vlplayer = {
        underVuffLimit: function (buff) {
            const player = this
            if (player.countVuffNum(buff) < get.vuffLimit(buff)) {
                return true
            } else {
                return false
            }
        },
        isMad: function () {
            return this.hasSkill('mad') || this.hasVuff('hunluan');
        },
        changeVuff: function () {
            return game.changeVuff(this, ...arguments);
        },
        changeVuffTo: function () {
            return game.changeVuffTo(this, ...arguments);
        },
        countVuff: function (filter) {
            const vuffs = get.vuffList(this);
            return vuffs.reduce((accumulator, currentElement) => {
                if (filter(currentElement)) {
                    return accumulator + 1;
                } else {
                    return accumulator;
                }
            }, 0);
        },
        getVuff: function (filter) {
            const vuffs = get.vuffList(this);
            return vuffs.filter(i => filter(i))
        },
        addVuff: function () {
            const next = game.createEvent('addVuff')
            for (let i = 0; i < arguments.length; i++) {
                if (typeof arguments[i] == 'number') {
                    next.num = arguments[i]
                } else if (typeof arguments[i] == 'string') {
                    next.buff = arguments[i]
                } else if (get.itemtype(arguments[i]) == 'player') {
                    next.source = arguments[i]
                }
            }
            next.player = this
            if (!next.source) next.source = 'nosource'
            if (next.num == undefined) next.num = 1
            next.setContent('addVuff')
            return next
        },
        reduceVuff: function () {
            const next = game.createEvent('reduceVuff')
            for (let i = 0; i < arguments.length; i++) {
                if (typeof arguments[i] == 'number') {
                    next.num = arguments[i]
                }
                else if (typeof arguments[i] == 'string') {
                    if (['naturalLose', 'isReject'].includes(arguments[i])) {
                        next[arguments[i]] = true;
                    } else {
                        next.buff = arguments[i];
                    }
                } else if (get.itemtype(arguments[i]) == 'player') {
                    next.source = arguments[i]
                }
            }
            next.player = this
            if (next.source == undefined) next.source = 'nosource'
            if (next.num == undefined) next.num = 1
            next.setContent('reduceVuff')
            return next
        },
        addTempVuff: function () {
            let source, num, expire, losetype, buff
            for (let i in arguments) {
                if (get.itemtype(arguments[i]) == 'player') {
                    source = arguments[i]
                } else if (typeof arguments[i] == 'number') {
                    num = arguments[i]
                } else if (['array', 'object'].includes(get.objtype(arguments[i]))) {
                    expire = arguments[i]
                } else if (['naturalLose', 'isReject'].includes(arguments[i])) {
                    losetype = arguments[i]
                } else {
                    buff = arguments[i]
                }
            }
            if (!num) num = 1
            num = Math.min(num, get.vuffLimit(buff) - this.countVuffNum(buff))
            if (num > 0) {
                if (!expire) {
                    expire = {
                        global: ['phaseAfter', 'phaseBefore']
                    }
                } else if (Array.isArray(expire) || typeof expire == 'string') {
                    expire = {
                        global: expire
                    }
                }
                this.when(expire).then(async () => {
                    const buff = event.buff
                    const num = event.num
                    const type = event.type
                    if (num > 0 && player.hasVuff(buff)) {
                        await player.reduceVuff(buff, num, type)
                    }
                }).assign({
                    buff: buff,
                    num: num,
                    type: losetype
                })
            }
            return this.addVuff(buff, num, source)
        },
        clearVuff: function (buff, type) {
            const player = this
            const num = player.countVuffNum(buff)
            return player.reduceVuff(buff, num, type)
        },
        countVuffNum: function (buff) {
            const player = this
            return get.vuffNum(player, buff)
        },
        hasVuff: function (filter) {
            const player = this
            const vuffs = get.vuffList(player)
            if (typeof filter == 'string') {
                if (player.countVuffNum(filter) > 0) {
                    return true
                } else {
                    return false
                }
            } else if (typeof filter == 'function') {
                return vuffs.some(i => filter(i))
            }
        },
        isImmVuff: function (buff) {
            const player = this
            return game.checkMod(player, buff, false, 'immerVuff', player)
        },
    };
    const vlgame = {
        findVuff: function (filter, value) {
            const list = []
            for (let i in lib.vuff) {
                if (get.vuffInfo(i, filter) == value) list.add(i)
            }
            return list
        },
        changeVuff: function () {
            const next = game.createEvent('changeVuff');
            for (let i = 0; i < arguments.length; i++) {
                if (get.itemtype(arguments[i]) == 'player') {
                    if (next.player == undefined) {
                        next.player = arguments[i];
                    } else {
                        next.source = arguments[i]
                    }
                } else if (typeof arguments[i] == 'string') {
                    if (['naturalLose', 'isReject'].includes(arguments[i])) {
                        next[arguments[i]] = true;
                    } else {
                        next.buff = get.vuffName(arguments[i]);
                    }
                } else if (typeof arguments[i] == 'number' && !next.num) {
                    next.num = arguments[i];
                }
            }
            if (next.source == undefined) next.source = 'nosource'
            if (!next.num) next.num = 1;
            if (next.num > 0) {
                next.num = game.checkMod(next.player, get.vuffName(next.buff, false), next.num, next.num, 'fixedVuff', next.player)
            }
            next.setContent('changeVuff');
            return next;
        },
        changeVuffTo: function () {
            const next = game.createEvent('changeVuffTo');
            for (let i = 0; i < arguments.length; i++) {
                if (get.itemtype(arguments[i]) == 'player') {
                    next.player = arguments[i];
                } else if (typeof arguments[i] == 'string') {
                    if (!next.from) {
                        next.from = get.vuffName(arguments[i]);
                    } else {
                        next.to = get.vuffName(arguments[i]);
                    }
                } else if (typeof arguments[i] == 'number') {
                    if (!next.num1) next.num1 = arguments[i];
                    else next.num2 = arguments[i];
                }
            }
            if (!next.num1) next.num1 = 1;
            if (next.num1 > 0) next.num1 = -next.num1;
            if (!next.num2) next.num2 = -next.num1;
            //num1为被转化掉的灵态的变化层数，会自动转化为负数，转化灵态的变化层数num2则默认为-num1
            //请不要将num2设定为正数
            next.setContent('changeVuffTo');
            return next;
        },
    };
    const vlcontent = {
        async addVuff(event, trigger, player) {
            if (!event.buff || game.checkMod(player, event.buff, 'addVuff', false, 'vuffIgnore', player)) {
                event.finish();
                return;
            }
            event.num = Math.min(get.vuffLimit(event.buff) - player.countVuffNum(event.buff), event.num);
            if (event.num <= 0) {
                event.finish();
                return;
            }
            await event.trigger('addVuffBegin1');
            if (event.source != 'nosource') event.source.line(player);
            await game.changeVuff(player, event.source, event.buff, event.num);
            await event.trigger('addVuffSource');
        },
        async reduceVuff(event, trigger, player) {
            if (event.buff == undefined || game.checkMod(player, event.buff, 'reduceVuff', false, 'vuffIgnore', player)) {
                event.finish();
                return;
            }
            event.num = Math.min(player.countVuffNum(event.buff), event.num);
            if (event.num <= 0) {
                event.finish();
                return;
            }
            await event.trigger('reduceVuffBegin1');
            await event.trigger('reduceVuffBegin2');
            if (event.source !== 'nosource') event.source.line(player);
            const arg1 = event.naturalLose ? 'naturalLose' : undefined;
            const arg2 = event.isReject ? 'isReject' : undefined;
            await game.changeVuff(player, event.source, get.vuffName(event.buff), -event.num, arg1, arg2);
            await event.trigger('reduceVuffSource');
        },
        async changeVuff(event, trigger, player) {
            if (player.isImmVuff(get.vuffName(event.buff, false)) && event.num > 0) {
                game.log(player, '因免疫', '#g「' + get.translation(event.buff) + '」', '无法被附加该灵态');
                event.finish();
                return;
            }
            if (game.checkMod(player, get.vuffName(event.buff, false), 'changeVuff', false, 'vuffIgnore', player)) {
                event.finish();
                return;
            }
            if (!event.isReject) {
                await event.trigger('changeVuffBegin1');
                await event.trigger('changeVuffBegin2');
            }
            if (!lib.vuff[get.vuffName(event.buff, false)]) {
                event.finish();
                return;
            }
            if (event.num > 0) {
                const reject = get.vuffInfo(event.buff, 'vuffReject');
                if (reject.length) {
                    for (let i = 0; i < reject.length; i++) {
                        const num2 = get.vuffNum(player, reject[i]);
                        if (!num2) continue;
                        await game.changeVuff(player, reject[i], -event.num, 'isReject');
                        game.log(player, '附加的', num2, '层', '#g「' + get.translation(event.buff) + '」', '被', '#g「' + get.translation(get.vuffName(reject[i])) + '」', '抵消');
                        event.num -= num2;
                        if (event.num <= 0) break;
                    }
                }
            }
            if (event.num != 0) {
                const vuff = event.buff;
                let num = event.num;
                let tip1, tip2;
                if (event.num > 0) {
                    if (!player.storage[vuff]) {
                        player.storage[vuff] = 0;
                        tip1 = '附加了';
                    } else {
                        tip1 = '增加了';
                    }
                    num = Math.min(get.vuffInfo(vuff, 'limit') - player.storage[vuff], num);
                } else {
                    tip1 = event.naturalLose == true ? '自然减少了' : '移除了';
                    num = -Math.min(player.storage[vuff] || 0, -num);
                }
                if (event.source != 'nosource') {
                    if (!player.storage[vuff + '_Source']) player.storage[vuff + '_Source'] = [];
                    player.storage[vuff + '_Source'].push(event.source);
                    tip2 = get.translation(event.source);
                } else {
                    tip2 = '';
                }
                if (num != 0) {
                    player.storage[vuff] += num;
                    player.syncStorage(vuff);
                    if (player.storage[vuff] > 0) {
                        player.addAdditionalSkill('vuff', vuff, true);
                        player.markSkill(vuff);
                    } else {
                        player.removeAdditionalSkill('vuff', vuff);
                        player.unmarkSkill(vuff);
                        delete player.storage[vuff + '_Source'];
                    }
                    game.log(player, event.source != 'nosource' ? '因' : '', '#b' + tip2, tip1, Math.abs(num), '层', '#g「' + get.translation(vuff) + '」');
                }
            }
            await event.trigger('changeVuff');
        },
        async changeVuffTo(event, trigger, player) {
            await event.trigger('changeVuffBeginTo1');
            await event.trigger('changeVuffBeginTo2');
            if (!lib.vuff[get.vuffName(event.to, false)] || !lib.vuff[get.vuffName(event.from, false)] || event.num1 == 0 || event.num2 == 0) {
                event.finish();
                return;
            }
            if (get.vuffNum(player, event.from) + event.num1 < 0) {
                await event.trigger('changeVuffBeginToFailed');
                event.finish();
                return;
            }
            const from = event.from, num1 = event.num1;
            const to = event.to;
            let num2 = event.num2;
            player.storage[from] += num1;
            player.syncStorage(from);
            if (player.storage[from] > 0) {
                player.addAdditionalSkill('vuff', from, true);
                player.markSkill(from);
            } else {
                player.removeAdditionalSkill('vuff', from);
                player.unmarkSkill(from);
            }
            const reject = get.vuffInfo(to, 'vuffReject');
            let rejectCost = 0;
            if (reject.length && num2 > 0) {
                for (let i = 0; i < reject.length; i++) {
                    let num3 = get.vuffNum(player, reject[i]);
                    if (!num3) continue;
                    if (num3 > num2) num3 = num2;
                    rejectCost += num3;
                    num2 -= num3;
                    const rejectBuff = get.vuffName(reject[i]);
                    player.storage[rejectBuff] -= num3;
                    player.syncStorage(rejectBuff);
                    if (player.storage[rejectBuff] <= 0) {
                        player.removeAdditionalSkill('vuff', rejectBuff);
                        player.unmarkSkill(rejectBuff);
                    }
                    event.rejectCost = rejectCost;
                    if (num2 <= 0) break;
                }
            }
            if (!player.storage[to]) player.storage[to] = 0;
            num2 = Math.min(get.vuffInfo(to, 'limit') - player.storage[to], num2);
            player.storage[to] += num2;
            player.syncStorage(to);
            if (player.storage[to] > 0) {
                player.addAdditionalSkill('vuff', to, true);
                player.markSkill(to);
            } else {
                player.removeAdditionalSkill('vuff', to);
                player.unmarkSkill(to);
            }
            game.log(player, '的', Math.abs(num1), '层「', from, '」', '转化成了', Math.abs(num2), '层「', to, '」');
        },
    }
    const vlskills = {
        _dieClearVuff: {
            trigger: {
                player: "die",
            },
            direct: true,
            forceDie: true,
            popup: false,
            priority: Infinity,
            async content(event, trigger, player) {
                for (const buff of Object.keys(lib.vuff)) {
                    if (player.hasVuff(buff)) {
                        await player.clearVuff(buff);
                    }
                }
            },
            _naturalLoseVuff: {
                trigger: {
                    player: "phaseAfter",
                },
                forced: true,
                popup: false,
                lastDo: true,
                filter(event, player) {
                    return get.vuffList(player).length > 0
                },
                async content(event, trigger, player) {
                    for (const buff of Object.keys(lib.vuff)) {
                        if (lib.vuff[buff].vuffInfo.naturalLose && player.hasVuff(buff)) {
                            if (!game.checkMod(player, buff, 'naturalLose', false, 'vuffIgnore', player)) {
                                await player.reduceVuff(buff, 1, 'naturalLose');
                            }
                        }
                    }
                }
            }
        }
    }
    const vltranslate = {
        _dieClearVuff: "死亡清除",
        _naturalLoseVuff: "自然衰减"
    }
    Object.assign(lib.element.content, vlcontent);
    if (!lib.vuff) lib.vuff = {}
    Object.assign(lib.vuff, vuffs)
    for (let i in lib.vuff) {
        const vuff = lib.vuff[i];
        const name = 'vuff_' + i;
        if (!lib.skill[name]) lib.skill[name] = vlget.deepClone(vuff)
        lib.skill[name].marktext = "<img style=width:" + (lib.config.extension_十周年UI_newDecadeStyle ? "16px" : "28px") + " src=" + lib.assetURL + "extension/瓦尔亚纳/image/vuff/" + i + ".png>";
        lib.translate[name] = vuff.intro.name;
        lib.translate[name + '_name'] = vuff.intro.name;
        lib.translate[name + '_name_info'] = vlget.vuffContent(i) + vuff.intro.content;
    }
    Object.assign(get, vlget);
    Object.assign(lib.element.player, vlplayer);
    Object.assign(game, vlgame);
    Object.assign(lib.skill, vlskills)
    Object.assign(lib.translate, vltranslate)
}
