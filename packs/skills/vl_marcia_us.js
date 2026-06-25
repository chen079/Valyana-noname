import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    forced: true,
    mod: {
        globalFrom: function (from, to, distance) {
						return distance - 1;
					},
        globalTo: function (from, to, distance) {
						return distance + 1;
					},
    },
    t: {
        name: "御术",
        info: "锁定技，其他角色计算与你的距离时+1且你计算与其他角色的距离时-1。",
    },
};
