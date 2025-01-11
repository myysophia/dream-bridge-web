<template>
  <el-card class="school-card" :body-style="{ padding: 0 }">
    <!-- 学校Logo -->
    <div class="school-logo">
      <img 
        :src="school.logo" 
        :alt="school.name"
        :title="school.name"
        @error="handleImageError"
      >
    </div>

    <!-- 学校信息 -->
    <div class="school-info">
      <!-- 学校名称和代码 -->
      <div class="school-header">
        <div class="name-code">
          <h3 class="school-name">{{ school.name }}</h3>
          <span class="school-code">({{ school.code }})</span>
        </div>
        <div class="school-location">
          <el-icon><Location /></el-icon>
          <span>{{ school.region }}</span>
        </div>
      </div>

      <!-- 学校特色和重点信息 -->
      <div class="school-features">
        <el-tag 
          v-for="feature in school.features" 
          :key="feature"
          size="small"
          :type="getTagType(feature)"
        >
          {{ feature }}
        </el-tag>
        <span class="feature-points">
          <el-icon><Trophy /></el-icon>
          <span>博士点{{ school.doctorPoints }} | 硕士点{{ school.masterPoints }}</span>
        </span>
      </div>

      <!-- 分数信息 -->
      <div class="school-scores">
        <div class="score-item">
          <div class="score-label">最低分</div>
          <div class="score-value">{{ school.lowestScore }}</div>
        </div>
        <div class="score-item">
          <div class="score-label">最低位次</div>
          <div class="score-value">{{ school.lowestRank }}</div>
        </div>
        <div class="score-item">
          <div class="score-label">录取人数</div>
          <div class="score-value">{{ school.enrollmentNum }}</div>
        </div>
      </div>

      <!-- 历年分数趋势 -->
      <div class="score-history">
        <div class="history-title">
          <span>历年分数线</span>
          <el-tag size="small" type="info">{{ school.batch }}</el-tag>
        </div>
        <div class="history-list">
          <div v-for="(score, year) in school.historyScores" :key="year" class="history-item">
            <div class="year">{{ year }}年</div>
            <div class="score">{{ score }}分</div>
          </div>
        </div>
      </div>

      <!-- 联系信息 -->
      <div class="contact-info">
        <a :href="school.website" target="_blank" class="contact-item">
          <el-icon><Link /></el-icon>官网
        </a>
        <span class="contact-item">
          <el-icon><Phone /></el-icon>{{ school.phone }}
        </span>
      </div>

      <!-- 修改专业列表部分 -->
      <div class="subject-list">
        <div class="subject-title">一级学科</div>
        <div class="subject-tags">
          <el-tag
            v-for="subject in school.subjects"
            :key="subject"
            size="small"
            effect="plain"
          >
            {{ subject }}
          </el-tag>
        </div>
      </div>
    </div>

    <!-- 添加查看分数按钮 -->
    <div class="score-action">
      <el-button 
        type="primary" 
        link
        @click="handleViewScores"
      >
        查看历年分数线
        <el-icon><ArrowRight /></el-icon>
      </el-button>
    </div>

    <!-- 分数查询弹窗 -->
    <el-dialog
      v-model="showScoreDialog"
      :title="`${school.name}分数线查询`"
      width="680px"
      destroy-on-close
    >
      <div class="score-dialog">
        <!-- 查询表单 -->
        <div class="dialog-form">
          <el-form :model="queryForm" inline>
            <el-form-item label="年份">
              <el-select v-model="queryForm.year" placeholder="选择年份">
                <el-option
                  v-for="year in years"
                  :key="year"
                  :label="`${year}年`"
                  :value="year"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="科别">
              <el-select v-model="queryForm.type" placeholder="选择科别">
                <el-option label="普通类" value="普通类" />
                <el-option label="国家专项计划" value="国家专项计划" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleQuery">查询</el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 查询结果表格 -->
        <el-table
          v-if="queryResults.length"
          :data="queryResults"
          border
          stripe
          style="width: 100%"
        >
          <el-table-column prop="year" label="年份" width="100" />
          <el-table-column prop="type" label="科别" width="140" />
          <el-table-column prop="batch" label="录取批次" width="120" />
          <el-table-column label="最低分/最低位次">
            <template #default="{ row }">
              {{ row.score }}/{{ row.rank }}
            </template>
          </el-table-column>
          <el-table-column prop="provinceLine" label="省控线" width="100" />
        </el-table>

        <!-- 分数线趋势图 -->
        <div v-if="queryResults.length" class="score-chart">
          <div class="chart-title">分数线趋势</div>
          <!-- 这里可以添加折线图组件 -->
        </div>
      </div>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  Location, 
  Link, 
  Phone,
  Trophy,
  ArrowRight
} from '@element-plus/icons-vue'
import { mockScoreQuery, type ScoreQueryResult } from '../mock'
import { useRouter } from 'vue-router'

const props = defineProps<{
  school: {
    name: string
    code: string
    logo: string
    region: string
    features: string[]
    doctorPoints: number
    masterPoints: number
    website: string
    phone: string
    email: string
    subjects: string[]
    lowestScore: number      // 最低分
    lowestRank: number       // 最低位次
    enrollmentNum: number    // 录取人数
    batch: string           // 录取批次
    historyScores: Record<string, number> // 历年分数 {年份: 分数}
  }
}>()

const router = useRouter()

const getTagType = (feature: string) => {
  switch (feature) {
    case '985':
      return 'success'
    case '211':
      return 'warning'
    case '双一流':
      return 'info'
    default:
      return ''
  }
}

// 图片加载失败处理
const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = '/images/default-school-logo.png' // 设置默认图片
}

// 弹窗控制
const showScoreDialog = ref(false)

// 查询表单
const queryForm = ref({
  year: '',
  type: ''
})

// 可选年份
const years = ['2024', '2023', '2022', '2021', '2020']

// 查询结果列表
const queryResults = ref<(ScoreQueryResult & { year: string; type: string })[]>([])

// 查询处理
const handleQuery = () => {
  const key = `${queryForm.value.year}-${queryForm.value.type}`
  const result = mockScoreQuery[props.school.name]?.[key]
  
  if (result) {
    queryResults.value = [{
      ...result,
      year: queryForm.value.year,
      type: queryForm.value.type
    }]
  }
}

const handleViewScores = () => {
  const url = window.location.origin + router.resolve({
    path: `/school/${props.school.code}/scores`
  }).href
  window.open(url, '_blank')
}
</script>

<style scoped>
.school-card {
  height: 100%;
  transition: all 0.3s ease;
  border: none;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  }
}

.school-logo {
  height: 120px; /* 减小高度 */
  padding: 12px; /* 减小内边距 */
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #f0f0f0;
  
  img {
    max-width: 70%;
    max-height: 70%;
    object-fit: contain;
  }
}

.school-info {
  padding: 16px; /* 减小内边距 */
}

.school-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.name-code {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.school-name {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
}

.school-code {
  font-size: 13px;
  color: #909399;
}

.school-location {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #606266;
  font-size: 13px;
}

.school-features {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.feature-points {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #606266;
}

.contact-info {
  display: flex;
  gap: 16px;
  margin: 12px 0;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 4px;
  font-size: 13px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #606266;
  
  &:hover {
    color: #409EFF;
  }
}

.subject-list {
  padding: 12px;
  background: #fafafa;
  border-radius: 8px;
  margin-bottom: 12px;
}

.subject-title {
  font-size: 14px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 8px;
}

.subject-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.school-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;

  :deep(.el-tag) {
    border-radius: 4px;
    
    &.el-tag--success {
      background-color: #e6f7e9;
      border-color: #52c41a;
      color: #52c41a;
    }
    
    &.el-tag--warning {
      background-color: #fff7e6;
      border-color: #faad14;
      color: #faad14;
    }
    
    &.el-tag--info {
      background-color: #e6f4ff;
      border-color: #1890ff;
      color: #1890ff;
    }
  }
}

.school-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #34495e;
  font-size: 14px;

  .el-icon {
    color: #3498db;
    font-size: 18px;
  }
}

.school-contact {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #3498db;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #34495e;
  
  .el-icon {
    color: #3498db;
  }
  
  a {
    color: #3498db;
    text-decoration: none;
    
    &:hover {
      color: #2980b9;
      text-decoration: underline;
    }
  }
}

.school-subjects {
  display: none;
}

.school-scores {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 12px;
  margin: 12px 0;
  background: linear-gradient(135deg, #e6f7ff, #f0f9ff);
  border-radius: 8px;
  border: 1px solid #e6f7ff;
}

.score-item {
  text-align: center;
  padding: 6px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 6px;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
}

.score-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 2px;
}

.score-value {
  font-size: 16px;
  font-weight: bold;
  color: #1890ff;
}

.score-history {
  padding: 12px;
  background: #fafafa;
  border-radius: 8px;
  margin-bottom: 12px;
}

.history-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid #f0f0f0;
  font-weight: bold;
  color: #2c3e50;
}

.history-list {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 4px 0;
}

.history-item {
  flex: 0 0 auto;
  padding: 6px 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e8e8e8;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    border-color: #1890ff;
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
  }

  .year {
    font-size: 12px;
    color: #666;
    margin-bottom: 2px;
  }

  .score {
    font-size: 14px;
    font-weight: bold;
    color: #1890ff;
  }
}

.score-action {
  padding: 12px 16px;
  display: flex;
  justify-content: center;
  border-top: 1px solid #f0f0f0;
}

.score-dialog {
  .dialog-form {
    margin-bottom: 24px;
  }

  .chart-title {
    font-size: 16px;
    font-weight: bold;
    margin: 24px 0 16px;
    padding-left: 10px;
    border-left: 4px solid #409EFF;
  }
}

:deep(.el-dialog__body) {
  padding: 20px;
}

:deep(.el-form-item) {
  margin-bottom: 0;
}
</style> 