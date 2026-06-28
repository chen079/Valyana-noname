import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: ["gameDrawAfter", "loseAfter", "changeHp"],
        global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
    },
    forced: true,
    filter(event, player) {
        if (event.name == "gameDraw" || event.name == "changeHp") {
            return player.countCards("h") != player.getHp();
        }
        if (event.name == "gain" && event.player == player) {
            return player.countCards("h") > player.getHp();
        }
        let loseEvent = event.getl(player);
        if (!loseEvent || !loseEvent.hs || loseEvent.hs.length == 0 || player.countCards("h") >= player.getHp()) {
            return false;
        }
        let evt = event;
        for (let i = 0; i < player.getHp(); i++) {
            evt = evt.getParent("vl_faers_hc");
            if (evt.name != "vl_faers_hc") {
                return true;
            }
        }
        return false;
    },
    content: async function content(event, trigger, player) {
        let a = player.getHp() - player.countCards('h');
        if (a > 0) {
            await player.draw(a);
        } else if (a < 0) {
            await player.chooseToDiscard("h", true, -a, "allowChooseAll");
        }
    },
    group: "vl_faers_hc_1",
    subSkill: {
        "1": {
            trigger: {
                player: ["phaseDrawBefore", "phaseJudgeBefore"],
            },
            forced: true,
            popup: false,
            async content(event, trigger, player) {
                trigger.cancel();
                game.log(player, '跳过了', event.triggername == 'phaseDrawBefore' ? '摸牌阶段' : '判定阶段')
            },
            ai: {
                noh: true,
            },
            sub: true,
        },
    },
    t: {
        name: "恒常",
        info: "锁定技，你跳过你的摸牌阶段和判定阶段；你的手牌数始终等于你的体力值。",
    },
};
