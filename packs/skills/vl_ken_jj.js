import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "damageAfter",
    },
    forced: true,
    async content(event, trigger, player) {
					var evt = _status.event.getParent('phaseUse');
					if (evt && evt.name == 'phaseUse') {
						evt.skipped = true;
					}
					var evt = _status.event.getParent('phase');
					if (evt && evt.name == 'phase') {
						evt.finish();
					}
				},
    ai: {
        maixie_defend: true,
    },
    t: {
        name: "力场",
        info: "锁定技，当你受到伤害后，立刻结束当前回合。",
    },
};
