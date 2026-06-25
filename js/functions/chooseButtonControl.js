import { lib, game, ui, get, _status } from '../../../../noname.js'

export function chooseButtonControl(object) {
    const next = game.createEvent('chooseButtonControl');
    next.player = this;
    if (arguments.length == 1 && get.objtype(arguments[0]) == 'object') Object.assign(next, object);
    else for (const arg of arguments) {
        if (get.itemtype(arg) == 'dialog') next.dialog = arg;
        else if (typeof arg == 'number') next.dialog = get.idDialog(arg);
        else if (Array.isArray(arg)) next.createDialog = arg;
        else if (typeof arg == 'boolean') {
            if (next.forced == undefined) next.forced = arg;
            else next.multibutton = arg;
        }
        else if (typeof arg == 'function') {
            if (!next.control) next.control = arg;
            else if (!next.processAI) next.processAI = arg;
            else next.filterButton = arg;
        }
    }
    if (typeof next.dialog == 'number') next.dialog = get.idDialog(next.dialog);
    else if (get.itemtype(next.dialog) == 'dialog') next.closeDialog = true;
    else if (!next.dialog && Array.isArray(next.createDialog)) {
        next.dialog = ui.create.dialog.apply(this, next.createDialog);
        next.closeDialog = true;
    }
    next.forced ??= false;
    next.multibutton ??= false;
    next.control ??= () => 'ok';
    next.filterButton ??= () => true;
    if (next.isMine() == false && next.dialog) next.dialog.style.display = 'none';
    next.setContent(function () {
        'step 0';
        const chooseButton = function (event) {
            event.result ??= {};
            event.forceMine = true;
            event.buttons = [];
            for (const button of event.dialog.buttons) {
                button.classList.add('pointerdiv');
                button.classList.add('selectable');
            }
            event.dialog.open();
            event.custom.replace.button = function (button) {
                if (!event.dialog.contains(button.parentNode) || button.classList.contains('unselectable')) return;
                for (const item of event.dialog.buttons) item.classList.remove('unselectable');
                if (button.classList.contains('selected')) {
                    event.buttons.remove(button);
                    button.classList.remove('selected');
                    for (const item of event.dialog.buttons) {
                        if (!event.buttons.includes(item) && !event.filterButton(event.buttons.slice().add(item), item)) item.classList.add('unselectable');
                    }
                }
                else {
                    event.buttons.add(button);
                    button.classList.add('selected');
                    for (const item of event.dialog.buttons) {
                        if (event.buttons.includes(item)) continue;
                        if (!event.multibutton || !event.filterButton(event.buttons.slice().add(item), item)) item.classList.add('unselectable');
                    }
                }
                event.controls.replacex();
            };
            event.custom.replace.window = function () {
                event.buttons = [];
                for (const item of event.dialog.buttons) item.classList.remove('selected', 'unselectable');
                event.controls.replacex();
            };
            event.controls = ui.create.control();
            event.controls.replacex = function () {
                let args = event.control(event.buttons);
                const newControls = Array.isArray(args) ? args : args == null ? [] : [args];
                if (event.multibutton) {
                    newControls.remove('cancel2');
                    if (!event.forced) newControls.add('cancel2');
                }
                else if (!event.forced && !newControls.includes('cancel2') && (!newControls.length || !event.buttons.length)) newControls.add('cancel2');
                this.style.opacity = newControls.length > 0 ? 1 : 0;
                newControls.push(function (control) {
                    if (control == 'cancel2') event.result.bool = false;
                    else {
                        event.result.bool = true;
                        event.result.buttons = event.buttons;
                        event.result.links = event.buttons.map(button => button.link);
                        event.result.control = control;
                    }
                    event.dialog.close();
                    event.controls.close();
                    game.resume();
                    _status.imchoosing = false;
                });
                return this.replace.apply(this, newControls);
            };
            event.controls.replacex();
            game.pause();
            game.countChoose();
        };
        if (event.isMine()) chooseButton(event);
        else if (event.isOnline()) {
            event.player.send(chooseButton, event);
            event.player.wait();
            game.pause();
        }
        else {
            if (event.dialog && event.closeDialog) event.dialog.close();
            game.resume();
            _status.imchoosing = false;
            if (event.processAI) event.result = event.processAI(event, player);
            else if (!event.forced) event.result = { bool: false };
            else throw "processAI : " + event.getParent().name + "'s chooseButtonControl is forced";
            event.finish();
        }
        'step 1';
        if (event.result.control == 'cancel2') event.finish();
    });
    next._args = Array.from(arguments);
    return next;
};