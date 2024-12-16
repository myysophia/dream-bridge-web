<template>
  <div class="school-list">
    <el-collapse v-if="schools && schools.length > 0">
      <el-collapse-item v-for="school in schools" :key="school.id">
        <template #title>
          <div class="school-header">
            <span class="school-name">{{ school.name }}</span>
          </div>
        </template>

        <!-- 历年录取信息 -->
        <div class="history-info">
          <h4>历年录取信息</h4>
          <el-table :data="formatHistoryInfo(school.history_infos)" stripe>
            <el-table-column prop="year" label="年份" width="100" />
            <el-table-column prop="lowest_score" label="最低分" width="100" />
            <el-table-column prop="lowest_rank" label="最低位次" width="100" />
            <el-table-column prop="enrollment_num" label="录取人数" width="100" />
          </el-table>
        </div>

        <!-- 专业列表 -->
        <template v-if="school.parts">
          <div class="major-list" v-for="(majors, part) in school.parts" :key="part">
            <h4>{{ part }}</h4>
            <el-table :data="majors" stripe>
              <el-table-column prop="name" label="专业名称" />
              <el-table-column prop="rate" label="匹配度" width="120">
                <template #default="{ row }">
                  <el-progress 
                    :percentage="Math.round(row.rate * 100)" 
                    :status="getProgressStatus(row.rate)"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="weight" label="权重" width="100">
                <template #default="{ row }">
                  {{ formatWeight(row.weight) }}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-collapse-item>
    </el-collapse>

    <el-empty v-else description="暂无数据" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { School } from '@/types/api'

const props = defineProps<{
  schools: School[]
}>()

// 格式化历年录取信息
const formatHistoryInfo = (historyInfos: Record<string, any>) => {
  if (!historyInfos) return []
  return Object.entries(historyInfos).map(([year, info]) => ({
    year,
    lowest_score: info.lowest_score,
    lowest_rank: info.lowest_rank,
    enrollment_num: info.enrollment_num
  }))
}

// 获取进度条状态
const getProgressStatus = (rate: number) => {
  if (rate >= 0.8) return 'success'
  if (rate >= 0.6) return 'warning'
  return 'exception'
}

// 格式化权重
const formatWeight = (weight: number) => {
  return (weight * 100).toFixed(0) + '%'
}
</script>

<style scoped>
.school-list {
  margin-top: 10px;
}

.school-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.school-name {
  font-weight: bold;
  font-size: 16px;
  color: var(--el-color-primary);
}

.history-info, .major-list {
  margin: 15px 0;
}

h4 {
  margin: 10px 0;
  color: #666;
  font-size: 14px;
  font-weight: bold;
}

:deep(.el-progress) {
  margin: 0;
  width: 90%;
}

:deep(.el-table) {
  margin-top: 5px;
}

:deep(.el-collapse-item__header) {
  font-size: 16px;
  font-weight: bold;
}

:deep(.el-collapse-item__content) {
  padding: 20px;
}
</style> 