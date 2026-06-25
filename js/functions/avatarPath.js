import { lib, game, ui, get, _status } from '../../../../noname.js'

export function avatarPath(name, flat) {
    if (!name) return null;
    const info = lib.character[name];
    const ext = info?.[4]?.find(item => typeof item === 'string' && item.startsWith('ext:'));
    if (!flat) return ext || `character:${name}`;
    if (ext) return ext.replace(/^ext:/, 'extension/');
    return `extension/瓦尔亚纳/image/character/${name}.jpg`;
}

export function changeAvatarImage(name, name2, video, fakeme) {
    let node;
    if (this.name2 == name) {
        node = this.node.avatar2;
        this.smoothAvatar(true, video);
    }
    else if (this.name1 == name) {
        node = this.node.avatar;
        this.smoothAvatar(false, video);
    }
    if (!node) return;
    node.setBackgroundImage(`extension/福瑞拓展/image/skin/origin-standard/${name2}.jpg`);
    if (this == game.me && ui.fakeme && fakeme !== false) ui.fakeme.style.backgroundImage = node.style.backgroundImage;
    if (video != false) game.addVideo('changeAvatarImage', this, [name, name2]);
    game.broadcast((player, name, name2) => player.changeAvatarImage(name, name2, false), this, name, name2);
};