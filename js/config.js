import { lib, game, ui, get, ai, _status } from '../../../noname.js';

export let config = {
    HDcheckNew: {
        name: (() => {
            //孩子们，牢大在天上化为彩虹看着你们（bushi）
            const text = '点击查看更新公告';
            if (!document.getElementById('hd-rainbow-style')) {
                const style = document.createElement('style');
                style.id = 'hd-rainbow-style';
                let css = '';
                for (let i = 0; i < text.length; i++) {
                    const animName = `hd_bol_author_${i}`;
                    css += `@keyframes ${animName}{`;
                    for (let j = 0; j <= 20; j++) {
                        const r = Math.floor(Math.random() * 255);
                        const g = Math.floor(Math.random() * 255);
                        const b = Math.floor(Math.random() * 255);
                        css += `${j * 5}%{color:rgb(${r},${g},${b});text-shadow:0 0 5px rgba(${r},${g},${b},0.8);}`;
                    }
                    css += `}`;
                }
                style.innerHTML = css;
                document.head.appendChild(style);
            }
            return [...text].map((ch, i) => {
                const delay = (i * 0.3).toFixed(1);
                return `<span style="display:inline-block; animation:hd_bol_author_${i} 3s linear ${delay}s infinite; font-weight:bold; transition:color 0.5s;">${ch}</span>`;
            }).join('');
        })(),
        clear: true,
        onclick() {
            game.closeMenu();
            const extname = '瓦尔亚纳', dialog = ui.create.dialog();
            dialog.classList.add('fullwidth');
            dialog.classList.add('fullheight');
            dialog.add(ui.create.div('.placeholder'));
            const controls = ui.controls.slice();
            if (controls.length > 0) controls.forEach(i => i.hide());
            const closeButton = ui.create.div('.menubutton.round', '<span style="font-size:22px;">×</span>', dialog, () => {
                dialog.close();
                if (controls.length > 0) controls.forEach(i => i.show());
            });
            closeButton.style.top = `40px`;
            closeButton.style.left = `calc(100% - 155px)`;
            dialog.add(`${extname} ${lib.extensionPack[extname].version} 更新内容`);
            dialog.add(ui.create.div('.placeholder'));
            const changeLogList = _status.Valyana_ChangeLog;
            changeLogList.forEach(item => {
                switch (item.type) {
                    case 'text':
                        const list = Array.isArray(item.data) ? item.data : [item.data];
                        if (item.addText) list.forEach(value => dialog.addText(value));
                        else {
                            list.forEach(value => {
                                const li = document.createElement('li');
                                li.innerHTML = value;
                                li.style.textAlign = item.textAlign || 'center';
                                dialog.content.appendChild(li);
                            });
                        }
                        break;
                    case 'players':
                        dialog.addSmall([item.data, 'character']);
                        dialog.classList.add('forcebutton');
                        dialog.classList.add('withbg');
                        break;
                    case 'cards':
                        dialog.addSmall([item.data.map(value => [get.translation(get.type(value)), '', value]), 'vcard']);
                        dialog.classList.add('forcebutton');
                        dialog.classList.add('withbg');
                        break;
                    default:
                        return;
                }
            });
            dialog.open();
        },
    },
}