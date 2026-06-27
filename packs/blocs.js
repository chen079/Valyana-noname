export const mergeShouzuReservedBlocs = new Set(['vl_haizu', 'vl_yizu', 'vl_longzu', 'vl_jiqi', 'vl_shouzu']);

export function shouldMergeToShouzu(bloc) {
    return Object.prototype.hasOwnProperty.call(blocs, bloc) && !mergeShouzuReservedBlocs.has(bloc);
}

export function getMergedShouzuBloc(bloc) {
    return shouldMergeToShouzu(bloc) ? 'vl_shouzu' : bloc;
}

export function getDisplayBlocs(mergeShouzu) {
    if (!mergeShouzu) return blocs;
    const displayBlocs = {};
    for (const key in blocs) {
        if (mergeShouzuReservedBlocs.has(key)) displayBlocs[key] = blocs[key];
    }
    return displayBlocs;
}

export const blocs = {
    vl_quanzu: {
        name: '犬',
        longName: '犬族',
        color: '#d83843',
        image: 'ext:瓦尔亚纳/image/group/quanke.png'
    },
    vl_maozu: {
        name: '猫',
        longName: '猫族',
        color: '#d6a800',
        image: 'ext:瓦尔亚纳/image/group/maoke.png'
    },
    vl_longzu: {
        name: '龙',
        longName: '龙族',
        color: '#2d2d2d',
        image: 'ext:瓦尔亚纳/image/group/longke.png'
    },
    vl_jiqi: {
        name: '机',
        longName: '机器',
        color: '#9733b8',
        image: 'ext:瓦尔亚纳/image/group/jiqi.png'
    },
    vl_haizu: {
        name: '海',
        longName: '海族',
        color: '#303cdf',
        image: 'ext:瓦尔亚纳/image/group/haizu.png'
    },
    vl_hulizu: {
        name: '狐',
        longName: '狐族',
        color: '#d78523',
        image: 'ext:瓦尔亚纳/image/group/huli.png'
    },
    vl_shizu: {
        name: '狮',
        longName: '狮族',
        color: '#d7d123',
        image: 'ext:瓦尔亚纳/image/group/shizi.png'
    },
    vl_langzu: {
        name: '狼',
        longName: '狼族',
        color: '#3c403d',
        image: 'ext:瓦尔亚纳/image/group/langzu.png'
    },
    vl_huzu: {
        name: '虎',
        longName: '虎族',
        color: '#705114',
        image: 'ext:瓦尔亚纳/image/group/laohu.png'
    },
    vl_tuzu: {
        name: '兔',
        longName: '兔族',
        color: '#becfc2',
        image: 'ext:瓦尔亚纳/image/group/tuzi.png'
    },
    vl_xiongzu: {
        name: '熊',
        longName: '熊族',
        color: '#5b3d23',
        image: 'ext:瓦尔亚纳/image/group/xiongzu.png'
    },
    vl_yangzu: {
        name: '羊',
        longName: '羊族',
        color: '#a82066',
        image: 'ext:瓦尔亚纳/image/group/yang.png'
    },
    vl_luzu: {
        name: '鹿',
        longName: '鹿族',
        color: '#3da820',
        image: 'ext:瓦尔亚纳/image/group/lu.png'
    },
    vl_guaiwu: {
        name: '怪',
        longName: '怪物',
        color: '#581506',
        image: 'ext:瓦尔亚纳/image/group/guai.png'
    },
    vl_shuzu: {
        name: '鼠',
        longName: '鼠族',
        color: '#79706e',
        image: 'ext:瓦尔亚纳/image/group/shu.png'
    },
    vl_shezu: {
        name: '蛇',
        longName: '蛇族',
        color: '#21e65e',
        image: 'ext:瓦尔亚纳/image/group/shezu.png'
    },
    vl_weizhi: {
        name: '匿',
        longName: '匿名',
        color: '#000000',
        image: 'ext:瓦尔亚纳/image/group/weizhi.png'
    },
    vl_baozu: {
        name: '豹',
        longName: '豹族',
        color: '#efa647',
        image: 'ext:瓦尔亚纳/image/group/baozu.png'
    },
    vl_yizu: {
        name: '翼',
        longName: '翼族',
        color: '#47beef',
        image: 'ext:瓦尔亚纳/image/group/yizu.png'
    },
    vl_zhuzu: {
        name: '猪',
        longName: '猪族',
        color: '#7d1c1c',
        image: 'ext:瓦尔亚纳/image/group/zhuzu.png'
    },
    vl_shouzu: {
        name: '兽',
        longName: '兽族',
        color: '#ef7347',
        image: 'ext:瓦尔亚纳/image/group/shouzu.png'
    },
    vl_niuzu: {
        name: '牛',
        longName: '牛族',
        color: '#af47ef',
        image: 'ext:瓦尔亚纳/image/group/niuzu.png'
    }
}
