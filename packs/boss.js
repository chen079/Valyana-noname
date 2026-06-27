export const boss = {
    vl_boss_hars: {
        enable: true,
        name: '哈尔斯',
        title: '降临的全知之神',
        gender: 'male',
        bloc: 'shen',
        hp: 6,
        intro: "哈尔斯，兽人的智慧之神。其拥有惑人心魄的能力。根据矮人族与部分兽人族内部记录。哈尔斯能够直接降临到任何一人身上，据此观察世界。而被降临的人则被称为「神降者」。由于任何人都有可能成为「神降者」。因此，哈尔斯的眼线遍布整个大陆，而其本人也被称为「全知之神」。<br><br>Boss版本。",
        prefix: "",
        skills: ["vl_boss_hars_hr", "vl_boss_hars_sj"],
        addition: ["boss", "bossallowed"],
        pack: 'ValyanaBoss',
        vp: 0,
        sort: 'vl_boss',
        rank: 'legend'
    },
    vl_templete: {
        enable: false,
        name: '🐺名字',
        title: '头衔',
        gender: 'male',
        bloc: '势力',
        hp: 3,
        intro: `简要介绍`,
        prefix: "🐺",
        skills: [],
        addition: ["boss","bossallowed"],
        pack: '武将包',
        vp: 0,
        sort: '分类',
        rank: '评级'
    },
}
