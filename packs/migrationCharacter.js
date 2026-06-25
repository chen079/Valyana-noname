import { createFurryMigrationPack } from './furryMigration.js';

export function createMigrationCharacterPack() {
	const pack = createFurryMigrationPack();
	return {
		character: pack.character,
		characterIntro: pack.characterIntro,
		characterTitle: pack.characterTitle,
		imageSources: pack.imageSources,
		ranks: pack.ranks,
	};
}
