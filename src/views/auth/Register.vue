<template>
  <div class="register-container">
    <el-card class="register-card">
      <template #header>
        <h2 class="title">注册</h2>
      </template>
      
      <el-form :model="registerForm" :rules="rules" ref="formRef">
        <el-form-item prop="email">
          <el-input 
            v-model="registerForm.email"
            placeholder="请输入邮箱"
            prefix-icon="Message"
          >
            <template #append>
              <el-button 
                @click="handleSendCode"
                :disabled="!!countdown"
              >
                {{ countdown ? `${countdown}s` : '获取验证码' }}
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        
        <el-form-item prop="code">
          <el-input 
            v-model="registerForm.code"
            placeholder="请输入验证码"
            prefix-icon="Key"
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input 
            v-model="registerForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleRegister" :loading="loading" block>
            注册
          </el-button>
        </el-form-item>
        
        <div class="actions">
          <router-link to="/login">已有账号？去登录</router-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Message, Lock, Key } from '@element-plus/icons-vue'
import { register, sendEmailCode } from '@/api/auth'

const router = useRouter()
const formRef = ref()
const loading = ref(false)
const countdown = ref(0)

const registerForm = ref({
  email: '',
  code: '',
  password: ''
})

const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码长度为6位', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ]
}

const startCountdown = () => {
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

const handleSendCode = async () => {
  if (!registerForm.value.email) {
    ElMessage.warning('请先输入邮箱')
    return
  }
  
  try {
    loading.value = true
    await sendEmailCode(registerForm.value.email)
    ElMessage.success('验证码已发送，请查收邮件')
    startCountdown()
  } catch (error: any) {
    ElMessage.error(error.message || '发送验证码失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const handleRegister = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate()
  
  try {
    loading.value = true
    await register(registerForm.value)
    ElMessage.success('注册成功')
    router.push('/login')
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
}

.register-card {
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