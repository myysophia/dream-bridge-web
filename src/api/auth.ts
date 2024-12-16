import request from '@/utils/request'
import type { LoginReq, LoginResp } from '@/types/api'

// 添加日志
export function login(data: LoginReq): Promise<LoginResp> {
    console.log('调用登录API, 发送数据:', {
        account: data.account,
        password: data.password?.length ? '已输入' : '未输入'
    })
    return request({
        url: '/api/v1/auth/login',
        method: 'post',
        data
    })
}

// 发送验证码
export const sendEmailCode = (email: string) => {
    return request.get('/api/v1/auth/email_code', { params: { email } })
}

// 注册
export const register = (data: LoginReq & { code: string }) => {
    return request.post('/api/v1/auth/register', data)
} 