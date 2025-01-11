export const mockSchools = [
    {
        name: '清华大学',
        code: '10003',
        logo: 'https://static-file.daxue.cn/images/清华大学.png',
        region: '北京',
        features: ['985', '211', '双一流'],
        doctorPoints: 86,
        masterPoints: 128,
        website: 'https://www.tsinghua.edu.cn',
        phone: '010-62793001',
        email: 'admissions@tsinghua.edu.cn',
        subjects: ['计算机科学与技术', '电子信息', '机械工程'],
        lowestScore: 680,
        lowestRank: 300,
        enrollmentNum: 120,
        batch: '本科一批',
        historyScores: {
            '2023': 680,
            '2022': 675,
            '2021': 671,
            '2020': 669,
            '2019': 665
        }
    },
    {
        name: '北京大学',
        code: '10001',
        logo: 'https://static-file.daxue.cn/images/北京大学.png',
        region: '北京',
        features: ['985', '211', '双一流'],
        doctorPoints: 92,
        masterPoints: 132,
        website: 'https://www.pku.edu.cn',
        phone: '010-62751407',
        email: 'bdzsb@pku.edu.cn',
        subjects: ['数学', '物理学', '化学'],
        batch: 'undergraduate',
        type: 'science'
    },
    {
        name: '浙江大学',
        code: '10335',
        logo: 'https://static-file.daxue.cn/images/浙江大学.png',
        region: '浙江',
        features: ['985', '211', '双一流'],
        doctorPoints: 78,
        masterPoints: 115,
        website: 'https://www.zju.edu.cn',
        phone: '0571-87951006',
        email: 'zsb@zju.edu.cn',
        subjects: ['生物工程', '电气工程', '控制科学'],
        batch: 'undergraduate',
        type: 'science'
    },
    {
        name: '复旦大学',
        code: '10246',
        logo: 'https://static-file.daxue.cn/images/复旦大学.png',
        region: '上海',
        features: ['985', '211', '双一流'],
        doctorPoints: 82,
        masterPoints: 125,
        website: 'https://www.fudan.edu.cn',
        phone: '021-65642601',
        email: 'zsb@fudan.edu.cn',
        subjects: ['临床医学', '经济学', '新闻传播'],
        batch: 'undergraduate',
        type: 'science'
    },
    {
        name: '南京大学',
        code: '10284',
        logo: 'https://static-file.daxue.cn/images/南京大学.png',
        region: '江苏',
        features: ['985', '211', '双一流'],
        doctorPoints: 76,
        masterPoints: 120,
        website: 'https://www.nju.edu.cn',
        phone: '025-89683251',
        email: 'admission@nju.edu.cn',
        subjects: ['物理学', '化学', '天文学'],
        batch: 'undergraduate',
        type: 'science'
    }
]

// 添加分数查询结果的类型定义
export interface ScoreQueryResult {
    batch: string
    score: number
    rank: number
    provinceLine: number
}

// 添加分数查询的模拟数据
export const mockScoreQuery: Record<string, Record<string, ScoreQueryResult>> = {
    '清华大学': {
        '2024-普通类': {
            batch: '本科一批',
            score: 682,
            rank: 311,
            provinceLine: 475
        },
        '2024-国家专项计划': {
            batch: '本科一批',
            score: 667,
            rank: 871,
            provinceLine: 475
        }
    }
    // ... 其他学校的数据
} 