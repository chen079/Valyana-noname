# 仓库指南

## 项目结构与模块组织

这是无名杀扩展“瓦尔亚纳”。入口是 `extension.js`，扩展信息在 `info.json`，根样式在 `extension.css`。`js/` 放运行时逻辑、配置、预加载、系统功能与工具函数；`packs/` 放角色、技能、卡牌、Boss、翻译和状态定义；`image/`、`audio/`、`css/` 放静态资源。

`docs/` 是机制和教程资料区，包含无名杀本体机制说明、游戏事件流程、启动流程、皮肤教程、异步写法等内容。实现技能或排查事件时，先查 `docs/game-event/`、`docs/async-guide.md`、`docs/lib-skill-format.md` 等文档；改动底层行为或补充新约定时同步更新对应文档。

## 新增角色流程

新增普通角色时按这个顺序做，不需要重新阅读加载链路：

1. 在 `packs/character.js` 添加角色对象；Boss 放 `packs/boss.js`。
2. 角色键名使用 `vl_角色名`。字段保持完整：`enable`、`name`、`title`、`gender`、`bloc`、`hp`、`intro`、`prefix`、`skills`、`addition`、`pack`、`vp`、`sort`、`rank`。
3. 头像放 `image/character/vl_角色名.jpg`。加载器会自动映射到该路径。
- 体力字段为：血量/上限/护甲。如1/6/5为1血六上限5护甲。
4. 每个技能建立 `packs/skills/技能名.js`，默认导出技能对象，并在 `t.name`、`t.info` 中写技能名和描述。可参考 `packs/skills/skillTemplete.js`。
5. 写技能时先在 `packs/skills/` 查找相似实现。若本扩展没有可参考技能，再到 `../../` 的无名杀 app 根目录只读参考游戏代码和本体武将包，常看 `../../character/`、`../../card/`、`../../mode/`、`../../game/` 等目录；不要改本体文件。
6. 若新增分包或分类，在 `packs/translation.js` 补 `pack` 或 `sort` 的显示名；若新增势力，在 `packs/blocs.js` 补势力、颜色和图标。
7. 技能描述中若用到术语、规则短语、其他技能名，优先用 `get.poptip("id")` 引用；缺词条时补 `js/precontent/poptips.json`。
8. 有动态描述时改 `packs/dynamicTranslate.js`；有皮肤或替换图时改 `packs/characterSubstitute.js`。
9. 增删文件后运行 `node js/scripts/generateFiles.cjs` 更新 `js/files.json`。

通常不要改 `js/precontent/loadCharacter.js`。它已经会读取角色数据、头像、技能翻译、稀有度、分包分类和技能文件。

### 换肤与原画切换

技能中使用 `player.changeSkin(...)` 切换到 `vl_角色名2`、`vl_角色名_die` 等替换原画时，不能只放图片和调用 `changeSkin`。必须同时在 `packs/characterSubstitute.js` 为原角色注册替换原画，例如：

```javascript
vl_zhan: [['vl_zhan2', ['ext:瓦尔亚纳/image/character/vl_zhan2.jpg']]],
```

替换图仍放在 `image/character/`，并在增删图片后运行 `node js/scripts/generateFiles.cjs`，确保 `js/files.json` 包含新图片。可参考 `vl_froh -> vl_froh2` 的写法。

## 重做角色流程

当用户明确要求“重做角色”时，不要直接覆盖或删除旧技能实现。先确认该角色在角色表中的 `skills` 列表，然后把对应 `packs/skills/技能名.js` 移动到 `packs/skills/archived/`。若归档目录中已有同名文件，先改成清晰的备份名，例如 `技能名_old.js` 或带日期后缀。

归档完成后，按新需求重新生成技能文件：在 `packs/skills/` 下创建新的 `技能名.js`，保持默认导出结构，补齐 `t.name`、`t.info` 和必要的 `derivation`、`ai`、`subSkill` 等字段。随后更新角色对象的 `skills` 数组，使它只引用重做后的技能；需要展示短说明时同步维护 `js/precontent/poptips.json`。最后运行 `node js/scripts/generateFiles.cjs`，确保 `js/files.json` 不再把旧位置作为有效技能来源。

## Poptip 词条维护

`js/precontent/poptips.json` 会在预加载时通过 `lib.poptip.add(poptip)` 注册。词条格式固定为 `{ "name": "显示名", "id": "引用ID", "info": "简短说明" }`。技能描述中使用 `` `${get.poptip("vl_crow_my")}` `` 生成可悬停说明。

新增或修改技能时，遇到这些情况要补词条：技能描述反复引用另一个技能、术语不是无名杀通用词、规则短语较长、临时获得的无实体技能需要解释。`id` 必须与 `get.poptip()` 参数一致；若是技能词条，通常与技能文件名一致。`info` 写结论式短描述，避免复制完整长技能，保持一两句话即可。

## 开发命令

- `node js/scripts/generateFiles.cjs`：重新生成 `js/files.json`。
- `cd js/scripts; .\run.bat`：在 Windows 下执行同一生成脚本。

本仓库没有独立 `package.json`。本地验证应放在无名杀 `extension/瓦尔亚纳` 目录中，启动游戏并启用扩展。

## 代码风格与命名

使用现有 ES Module 写法，按文件原有缩进继续编辑。技能、角色、资源名尽量保持 `vl_` 前缀和拼音小写风格。避免新增全局变量；除非无名杀 API 需要，否则优先使用 `const`、`let`。
技能文件中的自定义函数应和技能对象一起导出，作为对象字段挂在 `t` 同级；引用时统一写成 `lib.skill[skillName].functionName`，不要在文件顶层单独定义仅供本技能使用的辅助函数。

## storage 读写规范

新增或改写技能时，`player.storage.xxx = ...` 只保留给少数底层兼容场景；普通写入优先用 `player.setStorage(name, value)`，读取优先用 `player.getStorage(name, defaultValue)`。

需要维护列表型标记、并让标记状态随增删自动变化时，优先用 `player.markAuto(name, info)` 和 `player.unmarkAuto(name, info)`，不要直接改完数组后忘记刷新标记。

## 测试与提交

当前没有自动化测试。改技能后手动验证触发时机、目标选择、AI、标记和 `storage` 清理；改 UI 或资源后确认图片、音频和路径可加载。提交信息保持简短，参考历史风格，如 `fix vl_kulun mark cleanup`、`add bossPacks`。PR 需说明玩法影响、手测场景、是否更新 `js/files.json`，UI 改动附截图或录屏。

## 描述改正：
translation中所有提到的卡牌使用【】包裹，如：火【杀】、【南蛮入侵】
所有提到的技能用〖〗包裹，如〖寇敌〗、〖追逃〗
所有提到的buff用「」包裹，如「流血」、「震撼」
带“背水”的选项应单独标明代价，格式优先写成“背水：弃置两张牌。然后同时选择前两项”或等价表达；前两项若无代价，不要混写成“背水：弃置两张牌后选择一项”。

# storage 读写规范

- `player.storage.xxx = ...` 只保留给少数底层兼容场景。
- 普通写入优先用 `player.setStorage(name, value)`。
- 普通读取优先用 `player.getStorage(name, defaultValue)`。
- 列表型标记和自动刷新场景，优先用 `player.markAuto(name, info)` / `player.unmarkAuto(name, info)`。

# 设计原则

- 《熔炉》的世界发生于瓦尔亚纳大陆，这里位于“奇点”宇宙中的某个半位面之中。
- 瓦尔亚纳是多种族交融的大陆，建筑、生活方式和地域风貌高度混杂，角色分类应优先服从其出身地点、种族环境与叙事背景。
- 大陆西侧与东侧皆为无尽海洋；北有克拉，东有迦奈尔联邦，南跨人鱼之海可至极南之地，中部是人类诸国与深渊地带。
- 迦奈尔联邦以科技为主，克拉更接近中世纪社会，魔法、科技与奇异生物并存是世界基调。
- 编写角色、地点、事件与配置说明时，应默认用户点击“世界观”即可查看这套设定。

# 编写背景故事
- 移动到character.js的pack改为Valyana，否则无法正确显示分组
- 为角色补写 `intro` 前，必须先查看对应头像，并把可见外观线索转化为世界观内信息，如服饰、武器、姿态、场景、种族特征、道具和氛围。
- `intro` 应写出生平经历，不只写性格标签。优先包含出身地、早年遭遇、关键转折、能力来源、当前身份或行事动机。
- 可以参考技能效果提炼能力气质，但只能写成世界观表达；不要出现三国杀、牌、回合、摸牌、判定、目标等机制词。
- 角色分类 `sort` 应按故事中的地域、组织或身份归属分配；`vl_furry_migration` 只是临时分组，正式角色应迁入克拉王国、迦奈尔联邦、万灵之森、龙之谷、人鱼之海、米兰寺、矮人之心洞穴、游荡旅行者、兽神传说等已有分组。
- 背景故事和称号要互相呼应：称号保持短、凝练，优先概括角色能力、经历或传说名号；不要留空称号，除非是明确隐藏或临时形态。
- 文风以现有角色为准，通常用两段：第一段交代出身与经历，第二段写能力表现、传闻或现状。可使用 `<br>` 分段。
