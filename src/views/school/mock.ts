import schoolMajorCode from '@/config/schoolMajorCode.json'

// 将 schoolMajorCode 数据转换为我们需要的格式
export const mockSchools = schoolMajorCode.data.school.map(school => ({
    name: school.name,
    code: school.school_id,
    logo: `https://static-file.daxue.cn/images/${encodeURIComponent(school.name)}.png`,
    region: '待补充', // 需要补充地区信息
    features: [], // 需要补充特色信息
    doctorPoints: 0, // 需要补充博士点数量
    masterPoints: 0, // 需要补充硕士点数量
    website: '', // 需要补充官网
    phone: '', // 需要补充电话
    email: '', // 需要补充邮箱
    subjects: [], // 需要补充一级学科
    batch: '本科一批', // 需要补充批次
    historyScores: { // 需要补充历年分数
        '2024': 0,
        '2023': 0,
        '2022': 0,
        '2021': 0,
        '2020': 0
    }
}))

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