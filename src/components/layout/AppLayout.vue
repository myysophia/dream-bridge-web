<template>
  <el-container class="app-container">
    <el-header height="60px">
      <div class="header-content">
        <div class="logo">
          DreamBridge
        </div>
        <el-menu
          mode="horizontal"
          :router="true"
          :default-active="route.path"
        >
          <el-menu-item index="/user">个人信息</el-menu-item>
          <el-menu-item index="/recommend">志愿推荐</el-menu-item>
          <el-menu-item index="/score-distribution">
            <el-icon><DataLine /></el-icon>
            <span>一分一段表</span>
          </el-menu-item>
          <el-menu-item index="/school">
            <el-icon><Collection /></el-icon>
            <span>选择院校</span>
          </el-menu-item>
        </el-menu>
        <div class="user-info">
          <el-dropdown @command="handleCommand">
            <span class="user-dropdown">
              {{ userStore.username }}
              <el-icon><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </el-header>

    <el-main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { 
  ArrowDown, 
  DataLine, 
  Collection
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const handleCommand = (command: string) => {
  if (command === 'logout') {
    userStore.logout()
    router.push('/login')
  }
}
</script>

<style scoped>
.app-container {
  min-height: 100vh;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: var(--el-color-primary);
}

.user-info {
  display: flex;
  align-items: center;
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

:deep(.el-menu) {
  border-bottom: none;
}

:deep(.el-menu-item) {
  font-size: 16px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 