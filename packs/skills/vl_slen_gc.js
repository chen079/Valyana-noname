import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: ["loseAfter"],
        global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
    },
    forced: true,
    logTarget: _status.currentPhase,
    filter: function filter(event, player) {
					if(!_status.currentPhase || _status.currentPhase == player || _status.currentPhase.countGainableCards('he') == 0) return false;
					let evt = event.getl(player);
					return (
						evt &&
						evt.cards2.length
					);			
				},
    content: function content() {
					var target = _status.currentPhase;
					player.gainPlayerCard(target, 'he',"获得"+get.translation(target)+"的一张牌",true);
				},
    t: {
        name: "纲常",
        info: "锁定技，当你于回合外失去牌后，你获得当前回合角色的一张牌。",
    },
};
