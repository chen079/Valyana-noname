import { lib, game, ui, get, _status } from '../../../noname.js'
import { changeYun, $changeYun } from './functions/changeYun.js'
import { getInCenter } from './functions/getInCenter.js'
import { hubianSkill, changeHubian, $changeHubian } from './functions/hubian.js'
import { chooseText } from './functions/chooseText.js'
import { avatarPath } from './functions/avatarPath.js'
import { fenfaSkill } from './functions/fenfaSkill.js'
import { initShunfaSkill } from './functions/initShunfaSkill.js'
import { qianghua } from './functions/qianghua.js'

export const initFunctions = function (lib, game, ui, get, _status) {
    const importBody = {
        player: {
            'changeYun': changeYun,
            '$changeYun': $changeYun,
            'changeHubian': changeHubian,
            '$changeHubian': $changeHubian,
            'chooseText': chooseText,
            'fenfaSkill': fenfaSkill,
            'initShunfaSkill': initShunfaSkill,
            'qianghua': qianghua
        },
        game: {
            'getInCenter': getInCenter
        },
        skill: {
            'hubian': hubianSkill
        },
        get: {
            'avatarPath': avatarPath
        },
        content: {

        }
    }

    for (let i in importBody) {
        if (i === 'player') {
            Object.assign(lib.element.player, importBody['player'])
        } else if (i === 'game') {
            Object.assign(game, importBody['game'])
        } else if (i === 'skill') {
            Object.assign(lib.skill, importBody['skill'])
        } else if (i === 'get') {
            Object.assign(get, importBody['get'])
        }
    }
}
