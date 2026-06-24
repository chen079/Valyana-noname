import { lib, game, ui, get, _status } from '../../../../noname.js';
import { character } from '../../packs/character.js';
import { translation } from '../../packs/translation.js';

const galleryJudges = {
    vl_fangsuan: [5, 5, 3, 4, 5, 2, 5, 5],
    vl_wangshuo: [3, 2, 2, 5, 3, 5, 4, 4],
};

function getGalleryGroups() {
    const groups = {};
    for (const name in character) {
        const char = character[name];
        if (!char?.enable || !char.sort) continue;
        if (!groups[char.sort]) {
            groups[char.sort] = {
                name: translation[char.sort] || lib.translate?.[char.sort] || char.sort,
                characters: {},
            };
        }
        groups[char.sort].characters[name] = galleryJudges[name] || [];
    }
    return groups;
}

function getStars(num) {
    switch (num) {
        case 1: return '★☆☆☆☆☆';
        case 2: return '★★☆☆☆☆';
        case 3: return '★★★☆☆☆';
        case 4: return '★★★★☆☆';
        case 5: return '★★★★★☆';
        case 6: return '★★★★★★';
        default: return '☆☆☆☆☆☆';
    }
}

function getJudge(name, judges = [], details) {
    const char = character[name] || {};
    const title = char.title ? '称号：' + char.title + '</br>' : '';
    return [
        name,
        title + '<span class="bluetext">角色分析</span>：' + (details || '暂无'),
        '进攻：' + getStars(judges[0]) + ' 爆发：' + getStars(judges[1]) +
        ' </br>运气：' + getStars(judges[2]) + ' 生存：' + getStars(judges[3]) +
        ' </br>控制：' + getStars(judges[4]) + ' 辅助：' + getStars(judges[5]) +
        '</br>谋略：' + getStars(judges[6]) + ' 综合：' + getStars(judges[7]) + ' </br>',
    ];
}

function getIntro(name) {
    if (typeof get.characterIntro == 'function') return get.characterIntro(name);
    return character[name]?.intro || '暂无';
}

function createCharacterView(node, characterList) {
    const player = ui.create.player(null, true);
    player.init(characterList[0][0]);
    player.classList.add('valyanaGalleryPlayer');
    player.node.count.remove();
    player.node.avatar.classList.add('valyanaGalleryAvatar');
    node.appendChild(player);
    node.playerNode = player;

    const detailDialog = ui.create.dialog('hidden');
    detailDialog.classList.add('valyanaGalleryDetailDialog');
    detailDialog.noopen = true;
    node.appendChild(detailDialog);
    detailDialog.addText('<div id="valyanaGalleryDetail" class="valyanaGalleryDetail">' + characterList[0][2] + '</br><span class="bluetext">角色介绍</span>：' + getIntro(characterList[0][0]) + '</br>' + characterList[0][1]);

    const buttonDialog = ui.create.dialog('hidden');
    buttonDialog.classList.add('valyanaGalleryButtonDialog');
    buttonDialog.noopen = true;
    node.appendChild(buttonDialog);

    const names = characterList.map(item => item[0]);
    buttonDialog.add([names, 'character']);
    for (let i = 0; i < buttonDialog.buttons.length; i++) {
        buttonDialog.buttons[i].classList.add('noclick');
        buttonDialog.buttons[i].value = i;
        if (i > 0) buttonDialog.buttons[i].style.opacity = 0.7;
        buttonDialog.buttons[i].onclick = function () {
            buttonDialog.buttons.forEach(button => button.style.opacity = 0.7);
            this.style.opacity = 1;
            player.init(characterList[this.value][0]);
            const detail = document.getElementById('valyanaGalleryDetail');
            if (detail) {
                detail.innerHTML = characterList[this.value][2] + '</br><span class="bluetext">角色介绍</span>：' + getIntro(characterList[this.value][0]) + '</br>' + characterList[this.value][1];
            }
        };
    }
}

function createGalleryNodes(dialog, packNode) {
    const clickCaption = function () {
        const active = this.parentNode.querySelector('.active');
        if (active) {
            if (active == this) return;
            for (let i = 0; i < active.nodes.length; i++) {
                active.nodes[i].remove();
                if (active.nodes[i].showcaseInterval) {
                    clearInterval(active.nodes[i].showcaseInterval);
                    delete active.nodes[i].showcaseInterval;
                }
            }
            active.classList.remove('active');
        }
        this.classList.add('active');
        for (let i = 0; i < this.nodes.length; i++) dialog.content.appendChild(this.nodes[i]);
        const showcase = this.nodes[this.nodes.length - 1];
        showcase.style.height = (dialog.content.offsetHeight - showcase.offsetTop) + 'px';
        if (typeof showcase.action == 'function') {
            if (showcase.action(showcase.isShowcased ? false : true) !== false) showcase.isShowcased = true;
        }
        game.save('currentBrawl', 'help');
    };

    const createNode = function (name) {
        const info = lib.brawl[name];
        const node = ui.create.div('.dialogbutton.menubutton.large', info.name, packNode, clickCaption);
        node.classList.add('valyanaGalleryMenuButton');

        const intro = Array.isArray(info.intro) ? '<ul>' + info.intro.join('<br>') : (info.intro || '');
        const introNode = ui.create.div('.text.center.valyanaGalleryIntro', intro);

        const showcase = ui.create.div('.valyanaGalleryShowcase');
        showcase.action = info.showcase;
        showcase.link = name;

        node.nodes = [introNode, showcase];
        node.link = name;
        if (lib.storage.currentBrawl == name) clickCaption.call(node);
        return node;
    };

    for (const name in lib.brawl) {
        if (get.config(name) === false) continue;
        createNode(name);
    }
    if (!packNode.querySelector('.active') && packNode.firstChild) clickCaption.call(packNode.firstChild);
}

export function initValyanaGallerySystem() {
    const valyanaGallery = {
        content: {
            game: {
                createValyanaGalleryNodes: createGalleryNodes,
                createValyanaGalleryCharacterView: createCharacterView,
                getValyanaGalleryJudge: getJudge,
            },
            start: function () {
                ui.auto.hide();
                if (!_status.extensionmade) _status.extensionmade = [];

                const dialog = ui.create.dialog('hidden');
                dialog.classList.add('fixed');
                dialog.classList.add('scroll1');
                dialog.classList.add('scroll2');
                dialog.classList.add('fullwidth');
                dialog.classList.add('fullheight');
                dialog.classList.add('noupdate');
                dialog.classList.add('character');
                dialog.classList.add('valyanaGalleryDialog');
                dialog.contentContainer.classList.add('valyanaGalleryContentContainer');
                dialog.content.classList.add('valyanaGalleryContent');
                dialog.open();

                const packNode = ui.create.div('.packnode.valyanaGalleryPackNode', dialog);
                lib.setScroll(packNode);
                ui.background.setBackgroundImage('extension/瓦尔亚纳/image/gallery/galleryBackground.png');
                lib.game.createValyanaGalleryNodes(dialog, packNode);
                lib.init.onfree();
            },
            brawl: {},
        },
        config: {
            image: ['extension/瓦尔亚纳/image/gallery/valyanaGallery.jpg'],
            translate: '画廊',
            config: {
                galleryHelp: {
                    name: '画廊',
                    init: '1',
                    frequent: true,
                    item: {
                        1: '查看介绍',
                        2: '<li>本模式用于展示《瓦尔亚纳》扩展中的角色信息，包括角色介绍、称号、角色分析等内容。',
                        3: '<li>左键点击下方小头像查看对应角色介绍与分析。',
                    },
                },
            },
            onremove: function () {
                game.clearModeConfig('valyanaGallery');
            },
        },
    };

    const galleryGroups = getGalleryGroups();
    for (const groupName in galleryGroups) {
        const group = galleryGroups[groupName];
        valyanaGallery.content.brawl[groupName] = {
            name: group.name,
            mode: '',
            intro: '<div class="valyanaGalleryTitle">瓦尔亚纳角色群像：' + group.name + '</div>',
            showcase: function (init) {
                if (!init) return;
                const characterList = [];
                for (const name in group.characters) {
                    if (!character[name]?.enable) continue;
                    characterList.push(lib.game.getValyanaGalleryJudge(name, group.characters[name]));
                }
                if (characterList.length) lib.game.createValyanaGalleryCharacterView(this, characterList);
            },
        };
    }

    game.addMode('valyanaGallery', valyanaGallery.content, valyanaGallery.config);
    lib.mode.valyanaGallery.splash = 'ext:瓦尔亚纳/image/gallery/valyanaGallery.jpg';
}
