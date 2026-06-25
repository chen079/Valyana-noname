import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "shaBegin",
    },
    direct: true,
    filter: function (event, player) {
					if (get.itemtype(event.cards) != 'cards') return false;
					return true
				},
    content: function () {
					"step 0"
					player.storage.vl_olas_fh = 0;
					event.num = 0;
					event.cards = [];
					"step 1"
					if (event.num < 2 * trigger.target.maxHp) {
						var next = player.chooseToRespond({ name: 'sha' }, '是否发动【破空】，你还可以打出' + get.cnNumber(2 * trigger.target.maxHp - event.num) + '张【杀】')
							.set('prompt2', '你已打出' + get.cnNumber(event.num) + '张【杀】，对方当前需要使用' + get.cnNumber(event.num + 1) + '张【闪】响应此【杀】')
						next.ai = get.unuseful2;
					} else {
						event.goto(3)
					}
					"step 2"
					if (result.bool) {
						event.num += 1
						event.goto(1)
					}
					"step 3"
					if (event.num) {
						var next = trigger.target.chooseToRespond({ name: 'shan' }, '请使用一张闪响应【破空】');
						next.ai = get.unuseful2;
						if (event.num > 1) next.set('prompt2', '共需额外打出' + event.num + '张闪');
					}
					else {
						event.finish();
					}
					"step 4"
					if (result.bool) {
						event.num--;
						event.goto(3);
					}
					else {
						trigger.untrigger();
						trigger.directHit = true;
						player.storage.vl_olas_fh = event.num;
					}
				},
    group: ["vl_olas_fh_2", "vl_olas_fh_3"],
    subSkill: {
        "2": {
            trigger: {
                source: "damageBegin",
            },
            forced: true,
            popup: false,
            filter: function (event, player) {
							return event.card && event.card.name == 'sha' && player.storage.vl_olas_fh > 0 && event.parent.name != '_lianhuan' && event.parent.name != '_lianhuan2';
						},
            content: function () {
							trigger.num += player.storage.vl_olas_fh;
							player.storage.vl_olas_fh = 0;
						},
            sub: true,
        },
        "3": {
            trigger: {
                player: "shaEnd",
            },
            silent: true,
            content: function () {
							player.storage.vl_olas_fh = 0;
						},
            forced: true,
            popup: false,
            sub: true,
        },
    },
    t: {
        name: "破空",
        info: "当你使用一张杀指定目标后，你可以打出至多X张【杀】（X为目标角色体力上限的两倍），若如此做，目标需额外打出等量的【闪】，每少打出一张【闪】，此杀的伤害+1。",
    },
};
