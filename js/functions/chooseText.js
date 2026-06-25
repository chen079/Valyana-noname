import { game, ui, get, _status } from "../../../../noname.js";

export function chooseText(params) {
    const next = game.createEvent("chooseText");
    const args = [...arguments];
    if (args.length == 1 && params != null && get.is.object(params) && get.itemtype(params) == null) {
        Object.assign(next, params);
        if (params.prompt != null) {
            delete next.prompt;
            get.evtprompt(next, params.prompt);
        }
    } else {
        for (const arg of args) {
            if (typeof arg == "boolean") {
                next.forced = arg;
            } else if (Array.isArray(arg)) {
                next.filterText = arg;
            } else if (typeof arg == "function") {
                if (next.ai) {
                    next.filterText = arg;
                } else {
                    next.ai = arg;
                }
            } else if (typeof arg == "string") {
                get.evtprompt(next, arg);
            } else if (get.itemtype(arg) == "dialog") {
                next.dialog = arg;
            } else if (typeof arg == "number") {
                next.max = arg;
            }
        }
    }
    if (next.forced == void 0) {
        next.forced = false;
    }
    next.player = this;
    next.setContent(async function (event, trigger, player) {
        let result;
        if (event.isMine()) {
            result = await new Promise(resolve => {
                if (event.dialog) {
                    event.dialog.open();
                } else {
                    event.dialog = ui.create.dialog(event.prompt || "请在下方输入文本");
                    if (event.prompt2) {
                        event.dialog.addText(event.prompt2, event.prompt2.length <= 20);
                    }
                }
                const div = document.createElement("div");
                const input = div.appendChild(document.createElement("input"));
                input.style.background = "black";
                input.style.opacity = "0.6";
                input.style.fontSize = "20px";
                input.style.textAlign = "center";
                input.style.color = "#c9c8a2";
                input.placeholder = "请在此输入文本";
                if (typeof event.max == "number") {
                    input.setAttribute("maxlength", event.max);
                }
                event.dialog.add(div);

                let settled = false;
                let cancel;
                const close = result2 => {
                    if (settled) {
                        return;
                    }
                    settled = true;
                    control.close();
                    if (cancel) {
                        cancel.close();
                    }
                    game.resume();
                    resolve(result2);
                };
                const confirm = () => {
                    if (event.filterText) {
                        const ok = typeof event.filterText == "function" ? event.filterText(input.value) : event.filterText.includes(input.value);
                        if (!ok) {
                            return alert("您输入的内容不符合要求");
                        }
                    }
                    close({
                        bool: true,
                        text: input.value || ""
                    });
                };
                const control = ui.create.control("确定", confirm);
                if (!event.forced) {
                    cancel = ui.create.control("取消", () => close({ bool: false }));
                }
                event.switchToAuto = () => close("ai");
                input.addEventListener("keydown", event2 => {
                    if (event2.key == "Enter") {
                        confirm();
                    }
                    event2.stopPropagation();
                });
                input.addEventListener("keyup", event2 => event2.stopPropagation());
                input.focus();
                game.pause();
                game.countChoose();
                event.choosing = true;
            });
        } else if (event.isOnline()) {
            result = await event.sendAsync();
        } else {
            result = "ai";
        }
        if (result == "ai") {
            const value = event.ai ? event.ai(event.getParent(), player) : -1;
            result = { bool: value != -1 || event.forced };
            if (result.bool) {
                result.text = value;
            }
        }
        event.result = result || { bool: false };
        _status.imchoosing = false;
        event.choosing = false;
        if (event.dialog) {
            event.dialog.close();
        }
    });
    next._args = args;
    next.forceDie = true;
    return next;
}
