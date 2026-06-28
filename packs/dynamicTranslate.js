import { lib, game, ui, get, ai, _status } from '../../../noname.js';

export const dynamicTranslate = {
	vl_francium_sx: function (player) {
		if (player.getStorage('hubian', false)) return get.prompt('hubianji') + '出牌阶段限一次，<li><span class="bluetext">圣咏：你可以令两名有手牌的角色交换手牌，然后你摸两张牌并回复1点体力；</span><li>暗涌：你可以将所有手牌当【杀】对一名其他角色使用，若此【杀】造成伤害，你摸X张牌（X为该角色体力上限且至多为6）。'
		return get.prompt('hubianji') + '出牌阶段限一次，<li>圣咏：你可以令两名有手牌的角色交换手牌，然后你摸两张牌并回复1点体力；<li><span class="bluetext">暗涌：你可以将所有手牌当【杀】对一名其他角色使用，若此【杀】造成伤害，你摸X张牌（X为该角色体力上限且至多为6）。</span>'
	},
	vl_francium_yl: function (player) {
		if (player.getStorage('hubian', false)) return get.prompt('hubianji') + '，每回合限三次，<li><span class="bluetext">圣咏：你的回合内，当你使用一张即时牌结算完毕后，你可以将此牌置于牌堆顶，然后从牌堆底摸一张牌；</span><li>暗涌：你的回合外，当一名其他角色进入濒死状态前，你可以将一张手牌当【杀】对其使用。'
		return get.prompt('hubianji') + '，每回合限三次，<li>圣咏：你的回合内，当你使用一张即时牌结算完毕后，你可以将此牌置于牌堆顶，然后从牌堆底摸一张牌；<li><span class="bluetext">暗涌：你的回合外，当一名其他角色进入濒死状态前，你可以将一张手牌当【杀】对其使用。</span>'
	},
	vl_zenia_yy: function (player) {
		if (player.vl_zenia_yy && player.vl_zenia_yy == '仄') return get.prompt('yunlvji') + '。出牌阶段限一次，<li>平：你可以令一名角色摸X张牌，然后弃置Y张手牌。<li><span class="bluetext">仄：你可以令一名角色弃置X张手牌，然后摸Y张牌（X为你的体力上限，Y为你的体力值）</span>。<li>转韵：你发动〖韵生〗结算完毕后。';
		return get.prompt('yunlvji') + '。出牌阶段限一次，<li><span class="bluetext">平：你可以令一名角色摸X张牌，然后弃置Y张手牌。</span><li>仄：你可以令一名角色弃置X张手牌，然后摸Y张牌（X为你的体力上限，Y为你的体力值）。<li>转韵：你发动〖韵生〗结算完毕后。</li>'
	},
	vl_pluvia_xs: function (player) {
		if (player.vl_pluvia_xs && player.vl_pluvia_xs == '仄') return get.prompt('yunlvji') + '。出牌阶段限一次，<li>平：你可以弃置一张【闪】，令一名角色回复1点体力。<li><span class="bluetext">仄：你可以弃置一张【杀】，对一名其他角色造成1点伤害。</span><li>转韵：你发动〖视新〗结算完毕后。';
		return get.prompt('yunlvji') + '。出牌阶段限一次，<li><span class="bluetext">平：你可以弃置一张【闪】，令一名角色回复1点体力。</span><li>仄：你可以弃置一张【杀】，对一名其他角色造成1点伤害。<li>转韵：你发动〖视新〗结算完毕后。</li>';
	},
	vl_buline_yt: function (player) {
		if (player.vl_pluvia_xs && player.vl_pluvia_xs == true) return '转换技。出牌阶段限一次，<li>阳：你可以令一名体力值最少的角色将体力值回复至与体力值最多的角色相等。<li><span class="bluetext">阴：你可以令一名体力值最多的角色将体力值失去至与体力值最少的角色相等。</span></li>（最多回复/失去3点体力）';
		return '转换技。出牌阶段限一次，<li><span class="bluetext">阳：你可以令一名体力值最少的角色将体力值回复至与体力值最多的角色相等。</span><li>阴：阴：你可以令一名体力值最多的角色将体力值失去至与体力值最少的角色相等。</li>（最多回复/失去3点体力）';
	},
	vl_hundun_sl: function (player) {
		if (player.getStorage('vl_hundun_sp', false)) return '<span class="bluetext">①每回合限一次，当你对其他角色造成伤害时，你可以令此伤害+1并获得该角色的一张牌。</span>②当你不因此技能使用【杀】指定目标后，你可以视为对其使用一张【杀】。';
		return '①每回合限一次，当你对“猎物”造成伤害时，你可以执行一项：1.令此次伤害+1；2.令该角色弃置两张牌；3.背水：你失去1点体力。②当你不因此技能使用【杀】指定目标后，你可以视为对目标使用一张【杀】。';
	},
	vl_sisk_wg: function (player) {
		if (player.vl_sisk_wg && player.vl_sisk_wg == '仄') return '出牌阶段限一次，你可以消耗1点魔力或失去1点体力，然后：<li>摸一张牌并获得1层' + get.prompt('shixue') + '。<li><span class="bluetext">重铸所有手牌，获得2层' + get.prompt("kangfen") + '。</span><li>转韵：你获得魔力后。'
		else return '出牌阶段限一次，你可以消耗1点魔力或失去1点体力，然后：<li><span class="bluetext">摸一张牌并获得1层' + get.prompt('shixue') + '。</span><li>重铸所有手牌，获得2层' + get.prompt("kangfen") + '。<li>转韵：你获得魔力后。'
	},
	vl_yinlong_jh: function (player) {
		const storage = player.getStorage('vl_yinlong_jh', [0, 0]);
		return '锁定技，弃牌阶段开始时，若你不是全场手牌唯一最多的角色，本回合手牌上限+2，否则你摸两张牌。当你的梅花牌因弃置进入弃牌堆时，你摸<span class="bluetext">' + storage[0] + '</span>张牌并可以使用至多<span class="bluetext">' + storage[1] + '</span>张牌。'
	},
	vl_sainit_jh: function (player) {
		if (!player.getStorage('vl_sainit_yq', false)) return '①回合开始时，你选择一名其他角色，直到你下次发动该技能，当该角色失去牌后，你摸等于此次失去牌数的牌；②当你的手牌数大于X时，你将手牌数弃至X（X为你体力上限）。'
		else return '回合开始时，你选择一名其他角色，直到你下次发动该技能，当该角色失去牌后，你摸等于此次失去牌数的牌。'
	},
	vl_azao_huxi: function (player) {
		const text = player.getStorage('vl_azao_huxi_hand', false) ? '放入手牌' : '置于你的武将牌上';
		return '锁定技，游戏开始时，你可以令一名其他角色获得“契者”标记。当“契者”或你将受到伤害时，防止此伤害并移除标记，然后你流失1点体力并观看牌堆顶X张牌，将其中两张' + text + '，称之为“护”（X为你发动此技能的次数且至少为2）。然后，你可以令一名其他角色获得“契者”标记。';
	},
};
