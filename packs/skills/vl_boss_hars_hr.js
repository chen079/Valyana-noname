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
                const evt = { filterCard(card, player, event) { return player.hasUseTarget(card); } };
                return getUsableNames(evt, player).length > 0;
            },
            async content(event, trigger, player) {
                const evt = { filterCard(card, player, event) { return player.hasUseTarget(card); } };
                const list = getUsableNames(evt, player);
                const buttonResult = await player.chooseButton(['浩然：选择要使用的牌名', [list, 'vcard']]).set('ai', function (button) {
                    const player = _status.event.player;
                    return player.getUseValue({ name: button.link[2], nature: button.link[3] });
                }).forResult();
                if (!buttonResult.bool || !buttonResult.links?.length) return;
                const link = buttonResult.links[0];
                const viewAs = { name: link[2], nature: link[3] };
                const cardResult = await player.chooseCard('he', true, '选择一张牌当作' + (get.translation(link[3]) || '') + get.translation(link[2]) + '使用').set('ai', function (card) {
                    return 7 - get.value(card);
                }).forResult();
                if (!cardResult.bool || !cardResult.cards?.length) return;
                player.logSkill('vl_boss_hars_hr_use');
                await player.chooseUseTarget(viewAs, cardResult.cards, true);
            },
            sub: true,
        },
    },
    t: {
        name: "浩然",
        info: "其他角色使用你使用过的牌名时（每轮开始时清除记录），须交给你一张牌。你可以将一张牌当未记录的即时牌名使用（回合内每回合限一次）。",
    },
};
