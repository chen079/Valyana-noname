import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: ["chooseToUse", "chooseToRespond"],
    usable: 3,
    locked: false,
    t: {
        name: "挥斩",
        info: "每回合限三次，你可以将任意张牌当无次数限制的任意【杀】使用或打出。目标角色可以将等量花色与之均不同的手牌当【闪】抵消之。",
    },
    filter(event, player) {
        if (!player.countCards("hes")) return;
        if (event.filterCard(get.autoViewAs({ name: "sha", storage: { miya_hz: true } }, "unsure"), player, event)) {
            return true
        };
        for (const nature of lib.inpile_nature) {
            if (event.filterCard(get.autoViewAs({ name: "sha", nature, storage: { miya_hz: true } }, "unsure"), player, event)) {
                return true
            }
        }
        return false;
    },
    chooseButton: {
        dialog(event, player) {
            const list = [];
            if (event.filterCard(get.autoViewAs({ name: "sha", storage: { miya_hz: true } }, "unsure"), player, event)) {
                list.push(["basic", "", "sha", null]);
            }
            for (const nature of lib.inpile_nature) {
                if (event.filterCard(get.autoViewAs({ name: "sha", nature, storage: { miya_hz: true } }, "unsure"), player, event)) {
                    list.push(["basic", "", "sha", nature]);
                }
            }
            return ui.create.dialog("挥斩", [list, "vcard"], "hidden");
        },
        check(button) {
            // 谋武圣的AI
            const player = _status.event.player;
            const card = { name: button.link[2], nature: button.link[3] };
            if (
                _status.event.getParent().type == "phase" &&
                game.hasPlayer(function (current) {
                    return player.canUse(card, current) && get.effect(current, card, player, player) > 0;
                })
            ) {
                switch (button.link[2]) {
                    case "sha":
                        if (button.link[3] == "fire") {
                            return 2.95;
                        } else if (button.link[3] == "thunder" || button.link[3] == "ice") {
                            return 2.92;
                        } else {
                            return 2.9;
                        }
                }
            }
            return 1 + Math.random();
        },
        backup(links, player) {
            return {
                filterCard: true,
                selectCard: [1, Infinity],
                check(card) {
                    if (ui.selected.cards.length >= Math.ceil(Math.random() * 2)) return 0;
                    return 6 - get.value(card);
                },
                viewAs: {
                    name: "sha",
                    nature: links[0][3],
                    storage: {
                        miya_hz: true,
                    }
                },
                position: "hes",
                popname: true,
                allowChooseAll: true,
                async precontent(event, trigger, player) {
                    event.getParent().addCount = false;
                }
            };
        },
        prompt(links, player) {
            return `将任意张牌当做${get.translation(links[0][3] || "")}【杀】使用或打出`;
        },
    },
    mod: {
        cardUsable(card, player) {
            if (card?.storage?.miya_hz) return Infinity
        }
    },
    group: "miya_hz_giveshan",
    subSkill: {
        giveshan: {
            direct: true,
            trigger: {
                player: "useCardToTargeted",
            },
            async content(event, trigger, player) {
                trigger.target.addTempSkill("miya_hz_shan");
            },
            sub: true,
        },
        shan: {
            enable: "chooseToUse",
            filter(event, player) {
                return event.getParent().skill === "miya_hz_backup";
            },
            selectCard() {
                return get.event().getParent().cards.length || 1;
            },
            position: "hs",
            prompt: "挥斩：将等量张花色与之均不同的手牌当【闪】响应此【杀】",
            filterCard(card, player) {
                const event = get.event();
                const cards = event.getParent().cards;
                const suits = [];
                cards.forEach(card2 => suits.push(get.suit(card2)));
                if (suits.includes(get.suit(card))) return false;
                return true;
            },
            check(card) {
                if (Math.random < Math.log10(get.player().countCards("h"))) return 0;
                return 5 - get.value(card);
            },
            viewAs: {
                name: "shan",
            },
        },
    },
}