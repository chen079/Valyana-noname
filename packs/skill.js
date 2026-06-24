import skillIndex from './skillIndex.json';

const skill = {};
await Promise.all(skillIndex.map(async (skillName) => {
    const module = await import(`./skills/${skillName}.js`);
    skill[skillName] = module.default; // 取默认导出
}));

export default skill;
