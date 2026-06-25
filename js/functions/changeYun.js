import { lib, game, ui, get, _status } from '../../../../noname.js'

const changeYun = function (skill) {
    this[skill] = this[skill] == '平' ? '仄' : '平';
    if (this.getStat('skill')[skill]) delete this.getStat('skill')[skill];
    game.log(this, '#g【', '#g' + get.translation(skill), '#g】', '的韵律转为' + this[skill]);
}

const $changeYun = function (skill) {
    const mark = this.marks[skill];
    if (!mark) return;
    mark.firstChild.reversed = !mark.firstChild.reversed;
    mark.firstChild.style.transform = mark.firstChild.reversed ? 'rotate(180deg)' : 'none';
};

export { changeYun, $changeYun }