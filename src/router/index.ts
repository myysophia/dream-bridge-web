import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import AppLayout from '@/components/layout/AppLayout.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            meta: { requiresAuth: true },
            children: [
                {
                    path: '',
                    redirect: '/user'
                },
                {
                    path: '/user',
                    name: 'UserInfo',
                    component: () => import('@/views/user/UserInfo.vue'),
                    meta: { title: '个人信息' }
                },
                {
                    path: '/recommend',
                    name: 'Recommend',
                    component: () => import('@/views/major/Recommend.vue'),
                    meta: { title: '志愿推荐' }
                },
                {
                    path: '/score-distribution',
                    name: 'ScoreDistribution',
                    component: () => import('@/views/score/ScoreDistribution.vue'),
                    meta: { title: '一分一段表' }
                }
            ]
        },
        {
            path: '/login',
            name: 'Login',
            component: () => import('@/views/auth/Login.vue'),
            meta: { requiresAuth: false }
        },
        {
            path: '/register',
            name: 'Register',
            component: () => import('@/views/auth/Register.vue'),
            meta: { requiresAuth: false }
        }
    ]
})

// 需要登录才能访问的路由
const authRoutes = ['/user', '/recommend', '/score-distribution']

router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore()
    const token = userStore.getToken()

    // 如果要访问需要登录的页面
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!token) {
            next('/login')
            return
        }

        // 有token但没有用户信息，尝试获取用户信息
        if (!userStore.userInfo) {
            try {
                await userStore.getUserInfo()
            } catch (error) {
                console.error('获取用户信息失败:', error)
                next('/login')
                return
            }
        }
    }

    next()
})

export default router 