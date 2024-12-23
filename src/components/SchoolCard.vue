<template>
  <div class="school-card">
    <div class="school-header">
      <h3 class="school-name">{{ school.name }}</h3>
      <div class="school-tags">
        <el-tag v-if="historyInfo" size="small">{{ historyInfo.lowest_score }}分</el-tag>
        <el-tag v-if="historyInfo" size="small" type="info">位次:{{ historyInfo.lowest_rank }}</el-tag>
      </div>
    </div>
    
    <div class="school-content">
      <div v-for="(majors, batch) in school.parts" :key="batch" class="batch-group">
        <div class="batch-title">{{ batch }}</div>
        <div class="major-list">
          <div v-for="major in majors" :key="major.name" class="major-item">
            <span class="major-name">{{ major.name }}</span>
            <div class="major-rate">
              <el-progress 
                :percentage="major.rate * 100" 
                :format="format"
                :stroke-width="8"
                :color="getColorByRate(major.rate)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { School } from '@/types/api'

const props = defineProps<{
  school: School
  year?: string
}>()

// 获取历史信息
const historyInfo = computed(() => {
  if (!props.year || !props.school.history_infos) return null
  return props.school.history_infos[props.year]
})

// 格式化匹配度
const format = (percentage: number) => {
  return `${percentage}%`
}

// 根据匹配度获取颜色
const getColorByRate = (rate: number) => {
  if (rate >= 0.8) return '#67C23A'
  if (rate >= 0.6) return '#E6A23C'
  return '#F56C6C'
}
</script>

<style scoped>
.school-card {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.school-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.school-name {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.school-tags {
  display: flex;
  gap: 8px;
}

.batch-group {
  margin-bottom: 12px;
}

.batch-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.major-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.major-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.major-name {
  width: 120px;
  font-size: 14px;
  color: #606266;
}

.major-rate {
  flex: 1;
}
</style> 