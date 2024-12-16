<template>
  <div class="recommend-container">
    <el-card v-loading="loading">
      <template #header>
        <div class="header">
          <h3>志愿推荐</h3>
          <el-button type="primary" @click="handleRefresh">刷新推荐</el-button>
        </div>
      </template>

      <div v-if="recommendData" class="recommend-content">
        <!-- 冲刺院校 -->
        <div class="school-section">
          <h4>冲刺院校</h4>
          <school-list :schools="recommendData.chong_schools" />
        </div>

        <!-- 稳妥院校 -->
        <div class="school-section">
          <h4>稳妥院校</h4>
          <school-list :schools="recommendData.wen_schools" />
        </div>

        <!-- 保底院校 -->
        <div class="school-section">
          <h4>保底院校</h4>
          <school-list :schools="recommendData.bao_schools" />
        </div>
      </div>

      <el-empty v-else description="暂无推荐结果" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getMajorRecommend } from '@/api/major'
import type { ZYMockResp } from '@/types/api'
import SchoolList from './components/SchoolList.vue'

const loading = ref(false)
const recommendData = ref<ZYMockResp | null>(null)

const fetchRecommend = async () => {
  try {
    loading.value = true
    const data = await getMajorRecommend()
    console.log('获取到推荐数据:', data)
    recommendData.value = data
  } catch (error) {
    console.error('获取推荐失败:', error)
    ElMessage.error('获取推荐失败')
  } finally {
    loading.value = false
  }
}

const handleRefresh = () => {
  fetchRecommend()
}

onMounted(() => {
  fetchRecommend()
})
</script>

<style scoped>
.recommend-container {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h3 {
  margin: 0;
}

.school-section {
  margin-bottom: 20px;
}

.school-section h4 {
  margin: 10px 0;
  color: #666;
}
</style> 