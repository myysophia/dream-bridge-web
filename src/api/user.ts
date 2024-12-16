import request from '@/utils/request'
import type { UserInfo, UserSetInfoReq } from '@/types/api'

export async function getUserInfo(): Promise<UserInfo> {
    console.log('[API] 开始请求用户信息')
    try {
        const response = await request({
            url: '/api/v1/user/info',
            method: 'get'
        })
        console.log('[API] 用户信息请求成功:', response)
        return response
    } catch (error) {
        console.error('[API] 用户信息请求失败:', error)
        throw error
    }
}

export async function setUserInfo(data: UserSetInfoReq): Promise<void> {
    const requestData = {
        province: data.province || null,
        exam_type: data.exam_type || null,
        school_type: data.school_type || null,
        score: data.score || null,
        province_rank: data.province_rank || null,
        physics: data.physics ?? null,
        history: data.history ?? null,
        chemistry: data.chemistry ?? null,
        biology: data.biology ?? null,
        geography: data.geography ?? null,
        politics: data.politics ?? null,
        holland: data.holland || null,
        interests: Array.isArray(data.interests)
            ? data.interests.join(',')
            : data.interests || null
    }

    console.log('[API] 开始更新用户信息:', requestData)
    try {
        await request({
            url: '/api/v1/user/info',
            method: 'post',
            data: requestData
        })
        console.log('[API] 用户信息更新成功')
    } catch (error) {
        console.error('[API] 用户信息更新失败:', error)
        throw error
    }
} 