<template>
  <div class="recommend-container">
    <el-card v-loading="loading">
      <template #header>
        <div class="card-header">
          <span>志愿推荐</span>
          <el-button @click="fetchRecommendData()" :loading="loading">
            刷新数据
          </el-button>
        </div>
      </template>

      <div v-if="recommendData" class="recommend-content">
        <!-- 冲刺院校 -->
        <div class="school-section" v-if="recommendData.chong_schools?.length">
          <h2>冲刺院校</h2>
          <school-card 
            v-for="school in recommendData.chong_schools" 
            :key="school.id"
            :school="school"
            :year="currentYear"
          />
        </div>

        <!-- 其他院校类型... -->
      </div>
      
      <el-empty v-else description="暂无推荐数据" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getRecommend } from '@/api/major'
import type { ZYMockResp } from '@/types/api'
import SchoolCard from '@/components/SchoolCard.vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const recommendData = ref<ZYMockResp | null>(null)
const currentYear = new Date().getFullYear().toString()

// 添加重试机制
const fetchRecommendData = async (retryCount = 3) => {
  loading.value = true
  try {
    recommendData.value = await getRecommend({ year: currentYear })
  } catch (error) {
    console.error('获取推荐学校失败:', error)
    if (retryCount > 0) {
      ElMessage.warning('正在重试获取数据...')
      await new Promise(resolve => setTimeout(resolve, 2000)) // 等待2秒后重试
      return fetchRecommendData(retryCount - 1)
    }
    ElMessage.error('获取推荐数据失败，请刷新页面重试')
  } finally {
    loading.value = false
  }
}

// 页面加载时获取数据
fetchRecommendData()
</script>

<style scoped>
.recommend-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.school-section {
  margin-bottom: 24px;
}

.school-section h2 {
  margin-bottom: 16px;
  color: var(--el-text-color-primary);
}
</style> 