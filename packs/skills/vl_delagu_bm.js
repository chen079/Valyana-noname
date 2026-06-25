import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "dying",
    },
    filter: function (event, player) {
					var target = _status.currentPhase;
					return target != player;
				},
    check: function (event, player) {
					return player.maxHp > 1
				},
    content: function () {
					'step 0'
					player.loseMaxHp()
					player.recover(1 - player.hp)
					player.chooseUseTarget({ name: 'sha', nature: 'frmad' }, false, 'nodistance')
					'step 1'
					player.chooseUseTarget({ name: 'sha', nature: 'frmad' }, false, 'nodistance')
					'step 2'
					player.when({ global: 'phaseAfter' }).then(() => {
						phase.insertPhase();
					}).vars({
						phase: player
					})
				},
    t: {
        name: "不灭",
        info: "你回合外进入濒死状态时，可以减1点体力上限并回复体力至1点，可以视为使用两张无距离限制的狂【杀】；若如此做，本回合结束后你执行一个额外的回合。",
    },
};
