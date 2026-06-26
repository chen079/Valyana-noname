import { lib, game, ui, get } from '../../../noname.js';
import { changelog } from '../js/precontent/changelog.js';

function closeChangelogDialog(dialog, controls) {
    dialog.close();
    if (controls.length > 0) controls.forEach(control => control.show());
}

function addTextChange(dialog, item) {
    const values = item.data.filter(value => value);
    if (!values.length) return;
    values.forEach(value => {
        dialog.addText(value, item.textAlign !== 'left');
    });
}

function addButtonChange(dialog, item) {
    const data = item.data.filter(value => value);
    if (!data.length) return;
    const title = item.title || (item.type == 'players' ? '新增武将' : '新增卡牌');
    dialog.addText(title);
    if (item.type == 'players') {
        dialog.addSmall([data, 'character']);
    } else {
        dialog.addSmall([data.map(value => [get.translation(get.type(value)), '', value]), 'vcard']);
    }
}

function addVersionChange(dialog, version, list) {
    dialog.addText(version);
    list.forEach(item => {
        switch (item.type) {
            case 'text':
                addTextChange(dialog, item);
                break;
            case 'players':
            case 'cards':
                addButtonChange(dialog, item);
                break;
            default:
                break;
        }
    });
}

function showValyanaChangelog() {
    game.closeMenu();
    const dialog = ui.create.dialog('hidden');
    dialog.forcebutton = true;
    dialog.classList.add('fullwidth');
    dialog.classList.add('fullheight');
    dialog.classList.add('forcebutton');
    dialog.classList.add('withbg');
    dialog.classList.add('vl-changelog-dialog');
    dialog.content.style.boxSizing = 'border-box';
    dialog.content.style.padding = '0 36px 28px';
    dialog.add(ui.create.div('.placeholder'));

    const controls = ui.controls.slice();
    if (controls.length > 0) controls.forEach(control => control.hide());

    const closeButton = ui.create.div('.menubutton.round.vl-changelog-close', '×', dialog, () => {
        closeChangelogDialog(dialog, controls);
    });
    closeButton.setAttribute('aria-label', '关闭更新公告');
    closeButton.style.top = '40px';
    closeButton.style.left = 'auto';
    closeButton.style.right = '72px';

    dialog.add('更新公告');
    dialog.add(ui.create.div('.placeholder'));
    Object.entries(changelog).forEach(([version, list]) => addVersionChange(dialog, version, list));

    dialog.open();
}

export let config = {
    //参考活动武将
    VlcheckNew: {
        name: '点击查看更新公告',
        clear: true,
        onclick: showValyanaChangelog,
    },
    vpLoc: {
        name: '<b>灵能条显示位置</b>',
        intro: '可以设置灵能条在头像上显示的位置',
        init: lib.config.VpBarLocation !== undefined ? lib.config.VpBarLocation : 'shangcenei',
        item: {
            shangcenei: '上侧靠内',
            shangcewai: '上侧靠外',
            xiacenei: '下侧靠内',
            xiacewai: '下侧靠外',
            xiaceyou: '下侧靠右',
        },
        onclick(item) {
            game.saveConfig('extension_瓦尔亚纳_vpLoc', item);
            game.saveConfig('VpBarLocation', item);
        },
    },
    "vuffList": {
        name: "<b>查看Vuff列表",
        clear: true,
        intro: '查看福瑞拓展的Vuff列表',
        onclick: function () {
            get.vuffListDialog()
        }
    },
    mergeShouzu: {
        name: '合并兽族',
        intro: '将除【海族】、【翼族】、【龙族】、【机器】以外的势力合并为【兽族】',
        init: false,
    },
}
