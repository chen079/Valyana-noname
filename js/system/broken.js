import { lib, game, get } from '../../../../noname.js';

export function initBrokenSystem() {
    const vlplayer = {
        brokenHp: function () {
            const next = game.createEvent('brokenHp');
            next.player = this;
            for (let i = 0; i < arguments.length; i++) {
                if (typeof arguments[i] == 'number') next.num = arguments[i];
            }
            if (next.num == undefined) next.num = 1;
            next.filterStop = function () {
                this.num = Math.min(this.num, this.player.maxHp - this.player.countMark('brokenHp'));
                if (this.num <= 0) {
                    delete this.filterStop;
                    this.finish();
                    this._triggered = null;
                    return true;
                }
            };
            next.setContent('brokenHp');
            return next;
        },
        unbrokenHp: function () {
            const next = game.createEvent('unbrokenHp');
            next.player = this;
            for (let i = 0; i < arguments.length; i++) {
                if (typeof arguments[i] == 'number') next.num = arguments[i];
            }
            if (next.num == undefined) next.num = 1;
            next.filterStop = function () {
                this.num = Math.min(this.num, this.player.countMark('brokenHp'));
                if (this.num <= 0) {
                    delete this.filterStop;
                    this.finish();
                    this._triggered = null;
                    return true;
                }
            };
            next.setContent('unbrokenHp');
            return next;
        },
    };
    const vlcontent = {
        async brokenHp(event, trigger, player) {
            const { num } = event;
            await player.loseMaxHp(num);
            player.addMark('brokenHp', num, false);
            game.log(player, '被击碎了', get.translation(num), '个', '#g勾玉');
        },
        async unbrokenHp(event, trigger, player) {
            const { num } = event;
            await player.gainMaxHp(num);
            await player.recover(num);
            player.removeMark('brokenHp', num, false);
            game.log(player, '修复了', get.translation(num), '个', '#g碎玉');
        },
    };
    Object.assign(lib.element.player, vlplayer);
    Object.assign(lib.element.content, vlcontent);
}
