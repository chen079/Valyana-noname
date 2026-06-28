# storage 读写规范

- `player.storage.xxx = ...` 只保留给少数底层兼容场景。
- 普通写入优先用 `player.setStorage(name, value)`。
- 普通读取优先用 `player.getStorage(name, defaultValue)`。
- 列表型标记和自动刷新场景，优先用 `player.markAuto(name, info)` / `player.unmarkAuto(name, info)`。
