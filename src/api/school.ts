import request from '@/utils/request'

// 获取学校卡片信息
export function getSchoolCards(schoolIds: number[]) {
    const params = {
        school_ids: schoolIds.join(',')
    }
    console.log('API Request params:', params)

    return request({
        url: '/api/v1/school/cards',
        method: 'get',
        params,
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }).then(response => {
        console.log('Raw API Response:', response)
        return response
    }).catch(error => {
        console.error('API Error:', error)
        console.error('Error Response:', error.response)
        throw error
    })
}
