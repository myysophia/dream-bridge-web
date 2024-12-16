<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

onMounted(async () => {
    try {
        // 如果有token，尝试获取用户信息
        if (userStore.getToken()) {
            await userStore.getUserInfo()
        }
    } catch (error) {
        console.error('初始化用户信息失败:', error)
        // 如果获取用户信息失败，可能是token过期，跳转到登录页
        router.push('/login')
    }
})
</script>

<template>
  <router-view />
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

#app {
  height: 100%;
}
</style>
