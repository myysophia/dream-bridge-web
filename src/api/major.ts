import request from '@/utils/request'
import type { ZYMockResp } from '@/types/api'

// 获取专业推荐
export async function getMajorRecommend(): Promise<ZYMockResp> {
    console.log('[API] 开始请求专业推荐')
    try {
        const response = await request({
            url: '/api/v1/zy/recommend',
            method: 'get'
        })
        console.log('[API] 专业推荐请求成功:', response)
        return response
    } catch (error) {
        console.error('[API] 专业推荐请求失败:', error)
        throw error
    }
}

// 获取专业详情
export async function getMajorDetail(id: number) {
    console.log('[API] 开始请求专业详情, id:', id)
    try {
        const response = await request({
            url: `/api/v1/zy/${id}`,
            method: 'get'
        })
        console.log('[API] 专业详情请求成功:', response)
        return response
    } catch (error) {
        console.error('[API] 专业详情请求失败:', error)
        throw error
    }
} 