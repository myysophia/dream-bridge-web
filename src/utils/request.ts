import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const service: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 15000
})

// 请求拦截器
service.interceptors.request.use(
    (config) => {
        console.log('发送请求详情:', {
            url: config.url,
            method: config.method,
            headers: config.headers,
            data: config.data,
            params: config.params
        })

        // 避免在拦截器中重复创建store实例
        const token = localStorage.getItem('token')
        if (token) {
            config.headers['Authorization'] = token
            console.log('请求携带token:', token)
        }
        return config
    },
    (error) => {
        console.error('请求拦截器错误:', {
            message: error.message,
            stack: error.stack,
            error
        })
        return Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use(
    (response: AxiosResponse) => {
        console.log('收到响应详情:', {
            url: response.config.url,
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            data: response.data
        })
        const res = response.data
        if (res.code !== 1000) {
            console.error('业务状态码错误:', {
                code: res.code,
                message: res.message,
                data: res.data,
                response: res
            })
            ElMessage.error(res.message || '请求失败')
            return Promise.reject(new Error(res.message || '请求失败'))
        }
        return res.data
    },
    (error) => {
        console.error('响应拦截器错误:', {
            config: error.config,
            response: error.response?.data,
            message: error.message,
            stack: error.stack
        })
        ElMessage.error(error.response?.data?.message || '请求失败')
        return Promise.reject(error)
    }
)

export default service 