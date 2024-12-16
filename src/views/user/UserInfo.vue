<template>
  <div class="user-info-container">
    <el-card class="info-card">
      <template #header>
        <h3 class="title">个人信息</h3>
      </template>

      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" v-loading="loading">
        <el-form-item label="所在省份" prop="province">
          <el-select v-model="form.province" placeholder="请选择省份">
            <el-option label="陕西" value="陕西" />
            <el-option label="北京" value="北京" />
            <!-- 其他省份选项 -->
          </el-select>
        </el-form-item>

        <el-form-item label="考试类型" prop="exam_type">
          <el-select v-model="form.exam_type" placeholder="请选择考试类型">
            <el-option label="普通高考" value="普通高考" />
            <el-option label="专科提前批" value="专科提前批" />
          </el-select>
        </el-form-item>

        <el-form-item label="学校类型" prop="school_type">
          <el-select v-model="form.school_type" placeholder="请选择学校类型">
            <el-option label="本科" value="本科" />
            <el-option label="专科" value="专科" />
          </el-select>
        </el-form-item>

        <el-form-item label="高考分数" prop="score">
          <el-input-number v-model="form.score" :min="0" :max="750" />
        </el-form-item>

        <el-form-item label="省排名" prop="province_rank">
          <el-input-number v-model="form.province_rank" :min="1" />
        </el-form-item>

        <el-form-item label="选科情况" prop="physics">
          <el-radio-group v-model="selectedMainSubject">
            <el-radio :label="true">物理</el-radio>
            <el-radio :label="false">历史</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="选考科目">
          <el-checkbox-group v-model="selectedSubjects">
            <el-checkbox label="生物">生物</el-checkbox>
            <el-checkbox label="化学">化学</el-checkbox>
            <el-checkbox label="地理">地理</el-checkbox>
            <el-checkbox label="政治">政治</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="霍兰德类型" prop="holland">
          <el-select v-model="form.holland" placeholder="请选择霍兰德类型">
            <el-option label="常规型" value="conventional" />
            <el-option label="研究型" value="investigative" />
            <el-option label="艺术型" value="artistic" />
            <el-option label="社会型" value="social" />
            <el-option label="企业型" value="enterprising" />
            <el-option label="现实型" value="realistic" />
          </el-select>
        </el-form-item>

        <el-form-item label="兴趣爱好" prop="interests">
          <el-select
            v-model="form.interests"
            multiple
            filterable
            allow-create
            placeholder="请选择或输入兴趣爱好"
          >
            <el-option label="计算机" value="计算机" />
            <el-option label="人工智能" value="人工智能" />
            <el-option label="医学" value="医学" />
            <!-- 其他选项 -->
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="loading">
            保存信息
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import type { FormInstance } from 'element-plus'
import type { UserSetInfoReq } from '@/types/api'

const userStore = useUserStore()
const formRef = ref<FormInstance>()
const loading = ref(false)

const selectedSubjects = ref<string[]>([])
const selectedMainSubject = ref<boolean>(true)

const form = ref<UserSetInfoReq>({
  province: '',
  exam_type: '',
  school_type: '',
  score: undefined,
  province_rank: undefined,
  physics: false,
  history: false,
  chemistry: false,
  biology: false,
  geography: false,
  politics: false,
  holland: '',
  interests: []
})

// 监听主科选择变化
watch(selectedMainSubject, (newValue) => {
  form.value.physics = newValue
  form.value.history = !newValue
})

const rules = {
  province: [{ required: true, message: '请选择省份', trigger: 'change' }],
  exam_type: [{ required: true, message: '请选择考试类型', trigger: 'change' }],
  school_type: [{ required: true, message: '请选择学校类型', trigger: 'change' }],
  score: [{ required: true, message: '请输入高考分数', trigger: 'blur' }],
  province_rank: [{ required: true, message: '请输入省排名', trigger: 'blur' }],
  physics: [{ required: true, message: '请选择首选科目', trigger: 'change' }],
  holland: [{ required: true, message: '请选择霍兰德类型', trigger: 'change' }]
}

// 初始化用户信息
const initUserInfo = async () => {
  try {
    loading.value = true
    const userInfo = await userStore.getUserInfo()
    if (userInfo) {
      // 将用户信息填充到表单
      form.value = {
        province: userInfo.province || '',
        exam_type: userInfo.exam_type || '',
        school_type: userInfo.school_type || '',
        score: userInfo.score,
        province_rank: userInfo.province_rank,
        physics: userInfo.physics || false,
        history: userInfo.history || false,
        chemistry: userInfo.chemistry || false,
        biology: userInfo.biology || false,
        geography: userInfo.geography || false,
        politics: userInfo.politics || false,
        holland: userInfo.holland || '',
        // 如果interests是字符串，则分割为数组
        interests: userInfo.interests ? userInfo.interests.split(',') : []
      }
      // 设置主科选择
      selectedMainSubject.value = userInfo.physics || false
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    ElMessage.error('获取用户信息失败')
  } finally {
    loading.value = false
  }
}

// 在组件挂载时获取用户信息
onMounted(() => {
  initUserInfo()
})

// 监听选考科目变化，更新表单
const updateSubjects = () => {
  form.value.biology = selectedSubjects.value.includes('生物')
  form.value.chemistry = selectedSubjects.value.includes('化学')
  form.value.geography = selectedSubjects.value.includes('地理')
  form.value.politics = selectedSubjects.value.includes('政治')
}

// 在选考科目变化时更新表单
watch(selectedSubjects, () => {
  updateSubjects()
})

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate()
  updateSubjects()  // 确保选考科目是最新的
  
  try {
    loading.value = true
    await userStore.setUserInfo(form.value)
    ElMessage.success('保存成功')
  } catch (error) {
    console.error(error)
    ElMessage.error('保存失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.user-info-container {
  padding: 20px;
}

.info-card {
  max-width: 800px;
  margin: 0 auto;
}

.title {
  margin: 0;
  font-weight: normal;
  color: #333;
}

:deep(.el-select) {
  width: 100%;
}

:deep(.el-input-number) {
  width: 180px;
}
</style> 