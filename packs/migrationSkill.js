import { createFurryMigrationPack } from './furryMigration.js';

export function createMigrationSkillPack() {
	const pack = createFurryMigrationPack();
	return {
		skill: pack.skill,
		dynamicTranslate: pack.dynamicTranslate,
		translate: pack.translate,
	};
}
