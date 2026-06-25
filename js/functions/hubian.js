import { lib, game, ui, get, _status } from '../../../../noname.js'

const hubianSkill = {
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
}

const changeHubian = function () {
    if (!this.hasSkill('hubian')) this.addSkill('hubian');
    this.storage.hubian = !this.storage.hubian;
    this.markSkill('hubian');
    game.broadcastAll(player => player.$changeHubian(), this);
    game.log(this, '改变了其互变状态，当前状态为：', '#g' + (this.storage.hubian ? '圣咏' : '暗涌'));
};

const $changeHubian = function () {
    const mark = this.marks.hubian;
    if (mark) mark.firstChild.innerHTML = this.storage.hubian ? '圣咏' : '暗涌';
};

export { hubianSkill, changeHubian, $changeHubian }