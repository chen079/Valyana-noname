import { lib, game, ui, get, _status } from '../../../../noname.js'
export function initShunfaSkill(skillname) {
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
        if (info.round && info.round - (game.roundNumber - player.getStorage(skillname + '_roundcount', 0)) > 0) enable = false;
        if (info.filter && !info.filter(_status.event, player)) enable = false;
        if (!enable || !player.hasSkill(skillname, false, true, true)) return player.popup('不可发动', 'water', false);
        if (info.clickable) info.clickable(player);
        else player.useSkill(skillname);
    });
};
