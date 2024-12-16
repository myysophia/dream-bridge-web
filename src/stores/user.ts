import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserInfo, setUserInfo } from '@/api/user'
import type { UserInfo, UserSetInfoReq } from '@/types/api'

export const useUserStore = defineStore('user', () => {
    // 初始化时从 localStorage 获取 token
    const token = ref(localStorage.getItem('token') || '')
    const userInfo = ref<UserInfo | null>(null)

    // 设置token
    const setToken = (newToken: string) => {
        console.log('[Store] 设置token:', newToken)
        token.value = newToken
        localStorage.setItem('token', newToken)
    }

    // 获取token
    const getToken = () => {
        return token.value
    }

    // 清除token
    const clearToken = () => {
        console.log('[Store] 清除token')
        token.value = ''
        localStorage.removeItem('token')
    }

    // 获取用户信息
    const fetchUserInfo = async () => {
        console.log('[Store] 开始获取用户信息')
        const currentToken = getToken()
        console.log('[Store] 当前token:', currentToken)

        if (!currentToken) {
            console.log('[Store] 无token，返回null')
            return null
        }

        try {
            console.log('[Store] 调用用户信息API')
            const data = await getUserInfo()
            console.log('[Store] 获取到用户信息:', data)
            userInfo.value = data
            return data
        } catch (error) {
            console.error('[Store] 获取用户信息失败:', error)
            clearToken()
            throw error
        }
    }

    // 设置用户信息
    const updateUserInfo = async (info: UserSetInfoReq) => {
        try {
            await setUserInfo(info)
            // 更新成功后重新获取用户信息
            await fetchUserInfo()
        } catch (error) {
            console.error('[Store] 更新用户信息失败:', error)
            throw error
        }
    }

    // 登出
    const logout = () => {
        clearToken()
        userInfo.value = null
    }

    return {
        token,
        userInfo,
        setToken,
        getToken,
        clearToken,
        getUserInfo: fetchUserInfo,
        setUserInfo: updateUserInfo,
        logout
    }
}) 