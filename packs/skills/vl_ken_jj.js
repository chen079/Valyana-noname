import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "damageAfter",
    },
    forced: true,
    async content(event, trigger, player) {
        let phaseUseEvent = _status.event.getParent('phaseUse');
        if (phaseUseEvent && phaseUseEvent.name == 'phaseUse') {
            phaseUseEvent.skipped = true;
        }
        let phaseEvent = _status.event.getParent('phase');
        if (phaseEvent && phaseEvent.name == 'phase') {
            phaseEvent.finish();
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
