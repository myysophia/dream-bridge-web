// 登录相关
export interface LoginReq {
    account: string;
    password: string;
}

export interface LoginResp {
    token: string;
}

// 注册相关
export interface RegisterReq {
    username: string;
    email: string;
    password: string;
    code: string;
}

// 用户信息相关
export interface UserSetInfoReq {
    province?: string
    exam_type?: string
    school_type?: string
    score?: number
    province_rank?: number
    physics?: boolean
    history?: boolean
    chemistry?: boolean
    biology?: boolean
    geography?: boolean
    politics?: boolean
    holland?: string
    interests?: string | string[]
}

export interface UserInfo {
    id: number
    username: string
    email: string
    province?: string
    exam_type?: string
    school_type?: string
    score?: number
    province_rank?: number
    physics?: boolean
    history?: boolean
    chemistry?: boolean
    biology?: boolean
    geography?: boolean
    politics?: boolean
    holland?: string
    interests?: string
}

// 专业推荐相关
export interface HistoryInfo {
    lowest_score: number
    lowest_rank: number
    enrollment_num: number
}

export interface Major {
    id: number
    name: string
    rate: number
    weight: number
}

export interface School {
    id: number
    name: string
    history_infos: Record<string, HistoryInfo>
    parts: Record<string, Major[]>
}

export interface ZYMockResp {
    chong_schools: School[]
    wen_schools: School[]
    bao_schools: School[]
} 