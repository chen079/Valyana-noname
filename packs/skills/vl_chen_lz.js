import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    isWeapon(card) {
        return get.subtype(card) == 'equip1';
    },
    getWeaponFromPile() {
        const piles = Array.from(ui.cardPile.childNodes).concat(Array.from(ui.discardPile.childNodes));
        return piles.filter(card => lib.skill.vl_chen_lz.isWeapon(card));
    },
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
        return game.hasPlayer(target => lib.skill.vl_chen_lz.filterTarget(null, player, target));
    },
    filterTarget(card, player, target) {
        return target != player && (target.countCards('he', lib.skill.vl_chen_lz.isWeapon) > 0 || lib.skill.vl_chen_lz.getWeaponFromPile().length > 0);
    },
    async content(event, trigger, player) {
        const target = event.target;
        const choices = [];
        const choiceList = [
            '其将一张武器牌交给你，你将获得的武器牌置入装备区，并摸三张牌',
            '其令你从牌堆或弃牌堆中搜索并获得任意一张武器牌，你将该武器置入装备区，然后摸两张牌并获得该角色的一张牌',
        ];
        if (target.countCards('he', lib.skill.vl_chen_lz.isWeapon) > 0) choices.push('交出武器');
        if (lib.skill.vl_chen_lz.getWeaponFromPile().length > 0) choices.push('搜索武器');
        if (!choices.length) return;
        const result = await target.chooseControl(choices).set('choiceList', choiceList).set('ai', function () {
            const player = _status.event.player;
            const source = _status.event.getParent().player;
            if (get.attitude(player, source) > 0 && _status.event.controls.includes('搜索武器')) return '搜索武器';
            if (_status.event.controls.includes('交出武器')) return '交出武器';
            return '搜索武器';
        }).forResult();
        if (result.control == '交出武器') {
            const cardResult = await target.chooseCard('he', true, '临阵：交给' + get.translation(player) + '一张武器牌', lib.skill.vl_chen_lz.isWeapon).set('ai', function (card) {
                return 6 - get.value(card);
            }).forResult();
            if (!cardResult.bool) return;
            await target.give(cardResult.cards, player);
            await player.equip(cardResult.cards[0]);
            await player.draw(3);
        }
        else {
            const weapons = lib.skill.vl_chen_lz.getWeaponFromPile();
            if (!weapons.length) return;
            const buttonResult = await player.chooseCardButton('临阵：获得一张武器牌', weapons, true).set('ai', function (button) {
                return get.value(button.link, _status.event.player);
            }).forResult();
            if (!buttonResult.bool) return;
            const card = buttonResult.links[0];
            await player.gain(card, 'gain2');
            await player.equip(card);
            await player.draw(2);
            if (target.countCards('he') > 0) await player.gainPlayerCard(target, 'he', true);
        }
    },
    ai: {
        order: 8,
        result: {
            target(player, target) {
                if (get.attitude(player, target) > 0 && lib.skill.vl_chen_lz.getWeaponFromPile().length > 0) return 1;
                return -1;
            },
        },
    },
    t: {
        name: "临阵",
        info: "出牌阶段限一次，你可以指定一名其他角色，该角色必须选择一项:<li>1.其将一张武器牌交给你，你将获得的武器牌置入装备区，并摸三张牌。<li>2.其令你从牌堆或弃牌堆中搜索并获得任意一张武器牌，你将该武器置入装备区，然后摸两张牌并获得该角色的一张牌。",
    },
};
