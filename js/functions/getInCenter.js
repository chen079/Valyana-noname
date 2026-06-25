import { lib, game, ui, get, _status } from '../../../../noname.js'

export const getInCenter = function () {
    const list = [];
    game.getGlobalHistory('cardMove', function (evt) {
        if (evt.name == 'lose' && evt.position == ui.discardPile) list.addArray(evt.cards);
        else if (evt.name == 'cardsDiscard') list.addArray(evt.cards);
    });
    return list.filterInD('d');
}