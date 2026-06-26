import { lib, game, ui, get, ai, _status } from "../../../../noname.js";

export default {
  trigger: {
    player: "useCard",
  },
  filter(event, player) {
    if (get.suit(event.card) == "none") return false;
    let history = player.getHistory("useCard", function (evt) {
      return evt.card != event.card;
    });
    let suits = [];
    history
      .map((i) => i.card)
      .forEach((i) => {
        if (lib.suit.includes(get.suit(i))) suits.add(get.suit(i));
      });
    return !suits.includes(get.suit(event.card));
  },
  check(event, player) {
    if (player.countCards("h") < 4) return true;
    if (player.countCards("h") > 7) return false;
    return true;
  },
  mark: true,
  locked: false,
  mod: {
    aiOrder(player, card, num) {
      let history = player.getHistory("useCard");
      let suits = [];
      history
        .map((i) => i.card)
        .forEach((i) => {
          if (lib.suit.includes(get.suit(i))) suits.add(get.suit(i));
        });
      if (get.itemtype(card) == "card" && suits.includes(get.suit(card)))
        return num + 10;
    },
  },
  intro: {
    content(storage, player) {
      let history = player.getHistory("useCard");
      let suits = [];
      history
        .map((i) => i.card)
        .forEach((i) => {
          if (lib.suit.includes(get.suit(i)))
            suits.add(get.translation(get.suit(i)));
        });
      return "你使用过的花色：" + suits.join("、");
    },
  },
  async content(event, trigger, player) {
    let num = player.countCards("h");
    if (num > 4) player.chooseToDiscard("h", true, num - 4);
    else player.drawTo(4);
  },
  t: {
    name: "整军",
    info: "当你于一回合内首次使用某种花色的牌时，可以将手牌数调整4张。",
  },
};
