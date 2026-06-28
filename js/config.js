import { lib, game, ui, get } from '../../../noname.js';
import { changelog } from '../js/precontent/changelog.js';

function closeChangelogDialog(dialog, controls) {
    if (typeof dialog.delete === 'function') dialog.delete();
    else dialog.close();
    if (controls.length > 0) controls.forEach(control => control.show());
}

function createImageCloseButton(dialog, controls, ariaLabel) {
    const button = ui.create.div('.menubutton.round.vl-close-button', '', dialog, () => {
        closeChangelogDialog(dialog, controls);
    });
    button.setAttribute('aria-label', ariaLabel);
    button.style.position = 'absolute';
    button.style.top = '20px';
    button.style.left = 'auto';
    button.style.right = '20px';
    button.style.width = '34px';
    button.style.height = '34px';
    button.style.padding = '0';
    button.style.backgroundImage = `url(${lib.assetURL}extension/瓦尔亚纳/image/ui/exit.png)`;
    button.style.backgroundSize = '100% 100%';
    button.style.backgroundRepeat = 'no-repeat';
    button.style.fontSize = '0';
    button.style.color = 'transparent';
    button.style.zIndex = '9999';
    button.style.cursor = 'pointer';
    button.style.pointerEvents = 'auto';
    button.innerHTML = '';
    return button;
}

function getGradientText(text, styleId, animationName) {
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
@keyframes ${animationName} {
    0% { background-position: 0% 50%; }
    100% { background-position: 200% 50%; }
}`;
        document.head.appendChild(style);
    }
    return `<span style="
        display:inline-block;
        background:linear-gradient(90deg,#ff4d4d,#ffa94d,#fff04d,#59d66f,#55d7ff,#9b7bff,#ff4dd2,#ff4d4d);
        background-size:200% 100%;
        -webkit-background-clip:text;
        background-clip:text;
        -webkit-text-fill-color:transparent;
        color:transparent;
        animation:${animationName} 4s linear infinite;
        font-weight:bold;
        text-shadow:none;
    ">${text}</span>`;
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

    createImageCloseButton(dialog, controls, '关闭更新公告');

    dialog.add('更新公告');
    dialog.add(ui.create.div('.placeholder'));
    Object.entries(changelog).forEach(([version, list]) => addVersionChange(dialog, version, list));

    dialog.open();
}

function initDailyQuote() {
    const quoteNode = document.getElementById('vl-daily-quote');
    const fromNode = document.getElementById('vl-daily-from');
    if (!quoteNode || !fromNode) return;
    fetch('https://v1.hitokoto.cn/')
        .then(response => response.json())
        .then(hitokoto => {
            quoteNode.innerHTML = hitokoto.hitokoto || '今日无言';
            fromNode.innerHTML = `———${hitokoto.from || '佚名'}`;
        })
        .catch(() => {
            quoteNode.innerHTML = '您的网络或配置错误，无法获取一言内容。';
            fromNode.innerHTML = '———钫酸酱';
        });
}

let dailyQuoteTimer;
function watchDailyQuote() {
    if (dailyQuoteTimer) return;
    let count = 0;
    dailyQuoteTimer = setInterval(() => {
        const quoteNode = document.getElementById('vl-daily-quote');
        const fromNode = document.getElementById('vl-daily-from');
        if (quoteNode && fromNode) {
            clearInterval(dailyQuoteTimer);
            dailyQuoteTimer = undefined;
            initDailyQuote();
            return;
        }
        count += 1;
        if (count >= 40) {
            clearInterval(dailyQuoteTimer);
            dailyQuoteTimer = undefined;
        }
    }, 250);
}

export let config = {
    //参考活动武将
    vlLogo: {
        name: `<div style="width:100%; box-sizing:border-box; text-align:center; padding:6px 0 4px;">
            <img src="${lib.assetURL}extension/瓦尔亚纳/image/ui/logo.png" style="width:210px; max-width:72%; height:auto; display:block; margin:0 auto;">
        </div>`,
        clear: true,
        nopointer: true,
    },
    vlWorldview: {
        name: '世界观',
        clear: true,
        onclick() {
            game.closeMenu();
            ui.create.iframe(`${lib.assetURL}extension/瓦尔亚纳/docs/worldview.md`);
        },
    },
    VlcheckNew: {
        name: '点击查看更新公告',
        clear: true,
        onclick: showValyanaChangelog,
    },
    vlQqGroup: {
        name: `<div style="text-align:center; width:100%;">
            <div style="margin-bottom:8px; font-size:18px;">QQ群二维码</div>
            <img style="width:280px; max-width:80%; height:auto; border-radius:8px; box-shadow:0 0 0 1px rgba(255,255,255,0.18);" src="${lib.assetURL}extension/瓦尔亚纳/image/ui/qrcode.jpg">
        </div>`,
        clear: true,
        nopointer: true,
    },
    vlQqGroupLink: {
        name: getGradientText('QQ群跳转链接', 'vl-qq-link-style', 'vl-qq-link-gradient'),
        clear: true,
        onclick() {
            ui.click.configMenu();
            ui.create.iframe('https://qm.qq.com/q/V886KwI0EO');
        },
    },
    vlDailyQuote: {
        name: `<div style="width:100%; box-sizing:border-box; border:1px solid rgba(255,255,255,0.82); border-radius:3px; padding:6px 10px 8px; color:#fff;">
            <div style="font-size:18px; line-height:1.2; margin-bottom:6px;">每日一言：</div>
            <div id="vl-daily-quote" style="font-size:16px; line-height:1.6; white-space:pre-wrap; text-indent:2em; min-height:2.4em;">加载中...</div>
            <div style="display:flex; align-items:center; gap:8px; margin-top:6px;">
                <div style="flex:1; height:1px; background:rgba(255,255,255,0.65);"></div>
                <div id="vl-daily-from" style="flex:0 0 auto; font-size:14px; color:#ddd; white-space:nowrap;">———</div>
            </div>
        </div>`,
        clear: true,
        nopointer: true,
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
    loadFurryExtPack: {
        name: '加载旧福瑞扩展武将',
        intro: '开启后加载旧福瑞扩展武将包（FR旧扩展）',
        init: false,
    },
    valyanaBrawl: {
        name: '扩展乱斗',
        intro: '开启后，身份模式中AI只会从瓦尔亚纳武将包里选择武将，不会选择Boss包武将',
        init: false,
    },
}

watchDailyQuote();
