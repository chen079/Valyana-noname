import { lib, game, ui, get, _status } from '../../../../noname.js';

export async function qianghua() {
    if (this.hasSkill('_qianghua_effect')) return false;
    this.addSkill('_qianghua_effect');
    return true;
}
