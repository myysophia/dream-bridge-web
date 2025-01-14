import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const request = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 50000
})

// 请求拦截器
request.interceptors.request.use(
    (config) => {
        const userStore = useUserStore()
        const token = userStore.getToken()

        if (token) {
            config.headers.Authorization = token
        }
        console.log('发送请求:', config.url, config.params)  // 添加日志
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// 响应拦截器
request.interceptors.response.use(
    (response) => {
        const { code, message, data } = response.data
        console.log('收到响应:', response.data)  // 添加日志

        if (code === 1000) {
            return data
        }

        ElMessage.error(message || '请求失败')
        return Promise.reject(new Error(message))
    },
    (error) => {
        ElMessage.error(error.message || '请求失败')
        return Promise.reject(error)
    }
)

export default request 