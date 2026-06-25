import { lib, game, ui, get, _status } from '../../../../noname.js'

export function chooseText(object) {
    const next = game.createEvent('chooseText');
    if (arguments.length == 1 && get.objtype(arguments[0]) == 'object') Object.assign(next, object);
    for (const arg of arguments) {
        if (typeof arg == 'boolean') next.forced = arg;
        else if (Array.isArray(arg)) next.filterText = arg;
        else if (typeof arg == 'function') {
            if (next.ai) next.filterText = arg;
            else next.ai = arg;
        }
        else if (typeof arg == 'string') get.evtprompt(next, arg);
        else if (get.itemtype(arg) == 'dialog') next.dialog = arg;
        else if (typeof arg == 'number') next.max = arg;
    }
    next.forced ??= false;
    next.player = this;
    next.setContent(function () {
        'step 0';
        if (event.isMine()) {
            if (event.dialog) event.dialog.open();
            else {
                event.dialog = ui.create.dialog(event.prompt || '请在下方输入文本');
                if (event.prompt2) event.dialog.addText(event.prompt2, event.prompt2.length <= 20);
            }
            event.result = {};
            const div = document.createElement('div');
            const input = div.appendChild(document.createElement('input'));
            input.style.background = 'black';
            input.style.opacity = '0.6';
            input.style.fontSize = '20px';
            input.style.textAlign = 'center';
            input.style.color = '#c9c8a2';
            input.addEventListener('keydown', e => e.stopPropagation());
            input.addEventListener('keyup', e => e.stopPropagation());
            input.placeholder = '请在此输入文本';
            if (event.max) input.setAttribute('maxlength', event.max);
            event.dialog.add(div);
            game.pause();
            game.countChoose();
            event.choosing = true;
            const doClose = () => {
                button.remove();
                if (cancel) cancel.remove();
                game.resume();
            };
            const button = ui.create.control('确定', () => {
                if (event.filterText) {
                    const ok = typeof event.filterText == 'function' ? event.filterText(input.value) : event.filterText.includes(input.value);
                    if (!ok) return alert('您输入的内容不符合要求');
                }
                event.result.bool = true;
                event.result.text = input.value || '';
                doClose();
            });
            let cancel;
            if (!event.forced) {
                cancel = ui.create.control('取消', () => {
                    event.result.bool = false;
                    doClose();
                });
            }
            event.switchToAuto = () => {
                event.result = 'ai';
                doClose();
            };
        }
        else if (event.isOnline()) event.send();
        else event.result = 'ai';
        'step 1';
        if (event.result == 'ai') {
            const value = event.ai ? event.ai(event.getParent(), player) : -1;
            event.result = {};
            event.result.bool = value != -1 || event.forced;
            if (event.result.bool) event.result.text = value;
        }
        _status.imchoosing = false;
        event.choosing = false;
        if (event.dialog) event.dialog.close();
        event.resume();
    });
    next._args = Array.from(arguments);
    next.forceDie = true;
    return next;
}