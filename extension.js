//game.import(name: "瓦尔亚纳",
import { lib, game, ui, get, ai, _status } from '../../noname.js';
import { config } from './js/config.js';
import { precontent } from './js/precontent/index.js';
import { content } from './js/content.js';
import { help } from './js/help.js';

lib.init.css(lib.assetURL + 'extension/瓦尔亚纳', 'extension');

let extensionPackage = {
	name: '瓦尔亚纳',
	editable: false,
	content: content,
	precontent: precontent,
	config: config,
	help: help,
	files: {},
};

export let type = 'extension';
export default async function () {
	const { name, intro, ...otherInfo } = await lib.init.promises.json(`${lib.assetURL}extension/瓦尔亚纳/info.json`);
	extensionPackage.package = {
		...otherInfo,
		intro: [
			'钫酸是菜鸡口牙！',
		].join('<br>'),
	};
	return extensionPackage;
};
