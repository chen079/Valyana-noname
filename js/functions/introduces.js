import { lib, game, ui, get, _status } from '../../../../noname.js'
export function vlIntroduce(name, str) {
    if (str) return `<span class="bluetext">${name}</span>`;
    if (lib.vuff && lib.vuff[get.vuffName?.(name, false)]) {
        const intro = get.vuffIntro(name);
        return intro ? `『${intro.name}』` : `『${name}』`;
    }
    return get.poptip(name);
};

export function dialogIntro(name) {
    if (lib.vuff && lib.vuff[get.vuffName?.(name, false)]) {
        const intro = get.vuffIntro(name);
        return intro ? `『${intro.name}』` : `『${name}』`;
    }
    return get.poptip(name);
};