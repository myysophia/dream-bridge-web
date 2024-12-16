<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <h2 class="title">登录</h2>
      </template>
      
      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item prop="account">
          <el-input 
            v-model="form.account"
            placeholder="请输入用户名/邮箱"
            prefix-icon="User"
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input 
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleLogin" :loading="loading" block>
            登录
          </el-button>
        </el-form-item>
        
        <div class="actions">
          <router-link to="/register">注册账号</router-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import type { LoginReq } from '@/types/api'
import { login } from '@/api/auth'
import type { FormInstance } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

const formRef = ref<FormInstance>()
const loading = ref(false)
const form = ref<LoginReq>({
  account: '',
  password: ''
})

const rules = {
  account: [
    { required: true, message: '请输入用户名/邮箱', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!formRef.value) {
    console.log('[Login] formRef is null')
    return
  }
  
  try {
    console.log('[Login] 开始表单验证前的表单数据:', {
      account: form.value.account,
      password: form.value.password?.length ? '已输入' : '未输入'
    })

    // 先进行表单验证
    const validResult = await formRef.value.validate()
    console.log('[Login] 表单验证结果:', validResult)
    
    loading.value = true
    console.log('[Login] 准备调用登录接口')

    // 验证通过后调用登录接口
    const { token } = await login(form.value)
    console.log('[Login] 登录接口返回token:', token)
    
    // 保存token并获取用户信息
    console.log('[Login] 准备保存token到store')
    userStore.setToken(token)
    console.log('[Login] token已保存，准备获取用户信息')
    
    try {
        const userInfo = await userStore.getUserInfo()
        console.log('[Login] 获取用户信息成功:', userInfo)
    } catch (error) {
        console.error('[Login] 获取用户信息失败:', error)
        throw error
    }
    
    ElMessage.success('登录成功')
    router.push('/')
  } catch (error: any) {
    console.error('[Login] 登录过程出错:', {
      message: error.message,
      stack: error.stack,
      error
    })
    if (error.message) {
      ElMessage.error(error.message)
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
}

.login-card {
  width: 400px;
}

.title {
  text-align: center;
  margin: 0;
  font-weight: normal;
  color: #333;
}

.actions {
  text-align: right;
  margin-top: 10px;
}

.actions a {
  color: var(--el-color-primary);
  text-decoration: none;
}
</style> 