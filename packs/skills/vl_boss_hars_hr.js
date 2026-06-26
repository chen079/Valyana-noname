import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

function getRecorded(player) {
    if (!player.storage.vl_boss_hars_hr) player.storage.vl_boss_hars_hr = [];
    return player.storage.vl_boss_hars_hr;
}

function getUsableNames(event, player) {
    const recorded = getRecorded(player);
    const list = [];
    for (const name of lib.inpile) {
        if (recorded.includes(name)) continue;
        const type = get.type(name);
        if (type != 'basic' && type != 'trick') continue;
        if (name == 'sha') {
            if (event.filterCard({ name }, player, event)) list.push(['基本', '', name]);
            for (const nature of lib.inpile_nature) {
                if (event.filterCard({ name, nature }, player, event)) list.push(['基本', '', name, nature]);
            }
        }
        else if (event.filterCard({ name }, player, event)) {
            list.push([type == 'basic' ? '基本' : '锦囊', '', name]);
        }
    }
    return list;
}

export default {
    mark: true,
    intro: {
        content(storage) {
            if (!storage || !storage.length) return '本轮尚未记录牌名';
            return '本轮已记录牌名：' + get.translation(storage);
        },
    },
    init(player) {
        getRecorded(player);
    },
    trigger: {
        global: "useCard",
    },
    filter(event, player) {
        return event.player != player && getRecorded(player).includes(event.card.name) && event.player.countCards('he') > 0;
    },
    forced: true,
    logTarget: "player",
    async content(event, trigger, player) {
        const result = await trigger.player.chooseCard('he', true, '交给' + get.translation(player) + '一张牌').set('ai', function (card) {
            const source = _status.event.source;
            const target = _status.event.player;
            const att = get.attitude(target, source);
            if (att > 0) return 8 - get.value(card, target);
            return 5 - get.value(card, target);
        }).set('source', player).forResult();
        if (result.bool && result.cards?.length) await player.gain(result.cards, trigger.player, 'giveAuto');
    },
    ai: {
        threaten: 4,
        effect: {
            player(card, player, target, current) {
                const hars = game.findPlayer(function (current) {
                    return current != player && current.hasSkill('vl_boss_hars_hr') && current.getStorage('vl_boss_hars_hr').includes(card.name);
                });
                if (hars && get.attitude(player, hars) < 0 && player.countCards('he') > 0) return [1, -1.5];
            },
        },
    },
    group: ["vl_boss_hars_hr_record", "vl_boss_hars_hr_clear", "vl_boss_hars_hr_use"],
    subSkill: {
        record: {
            trigger: {
                player: "useCardAfter",
            },
            forced: true,
            silent: true,
            popup: false,
            async content(event, trigger, player) {
                const recorded = getRecorded(player);
                recorded.add(trigger.card.name);
                player.markSkill('vl_boss_hars_hr');
            },
            sub: true,
        },
        clear: {
            trigger: {
                global: "roundStart",
            },
            forced: true,
            silent: true,
            popup: false,
            async content(event, trigger, player) {
                player.storage.vl_boss_hars_hr = [];
                player.unmarkSkill('vl_boss_hars_hr');
            },
            sub: true,
        },
        use: {
            enable: "phaseUse",
            usable: 1,
            filter(event, player) {
                if (!player.countCards('he')) return false;
                return getUsableNames(event, player).length > 0;
            },
            chooseButton: {
                dialog(event, player) {
                    return ui.create.dialog('浩然：选择要使用的牌名', [getUsableNames(event, player), 'vcard']);
                },
                filter(button, player) {
                    const evt = _status.event.getParent();
                    return evt.filterCard({ name: button.link[2], nature: button.link[3] }, player, evt);
                },
                check(button) {
                    const player = _status.event.player;
                    return player.getUseValue({ name: button.link[2], nature: button.link[3] });
                },
                backup(links, player) {
                    return {
                        filterCard: true,
                        selectCard: 1,
                        position: 'he',
                        popname: true,
                        viewAs: { name: links[0][2], nature: links[0][3] },
                        check(card) {
                            return 7 - get.value(card);
                        },
                    };
                },
                prompt(links, player) {
                    return '将一张牌当作' + (get.translation(links[0][3]) || '') + get.translation(links[0][2]) + '使用';
                },
            },
            sub: true,
        },
    },
    t: {
        name: "浩然",
        info: "其他角色使用你使用过的牌名时（每轮开始时清除记录），须交给你一张牌。你可以将一张牌当未记录的即时牌名使用（若回合内，每回合限一次）。",
    },
};
