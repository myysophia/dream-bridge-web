<template>
  <div v-if="school" class="school-detail-layout">
    <!-- 左侧学校卡片 -->
    <div class="left-panel">
      <school-card :school="school" />
    </div>

    <!-- 右侧分数查询 -->
    <div class="right-panel">
      <h2>{{ school.name }} - 分数查询</h2>
      
      <!-- 分数数据展示 -->
      <el-tabs v-model="activeTab" class="score-tabs">
        <!-- 院校分数线 -->
        <el-tab-pane label="院校分数线" name="school">
          <!-- 院校分数查询条件 -->
          <div class="filter-section">
            <el-form :inline="true" :model="schoolQuery">
              <el-form-item label="年份">
                <el-select v-model="schoolQuery.year" class="filter-item">
                  <el-option label="2024" value="2024" />
                  <el-option label="2023" value="2023" />
                  <el-option label="2022" value="2022" />
                  <el-option label="2021" value="2021" />
                  <el-option label="2020" value="2020" />
                </el-select>
              </el-form-item>
              <el-form-item label="科类">
                <el-select v-model="schoolQuery.type" class="filter-item">
                  <el-option label="理科" value="理科" />
                  <el-option label="文科" value="文科" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="querySchoolScores">查询</el-button>
                <el-button @click="resetSchoolQuery">重置</el-button>
              </el-form-item>
            </el-form>
          </div>

          <!-- 院校分数趋势图 -->
          <div class="chart-section">
            <div class="chart-title">分数线趋势</div>
            <div class="chart-wrapper">
              <!-- 使用 ECharts 组件 -->
              <v-chart :option="schoolScoreChartOption" autoresize />
            </div>
          </div>

          <!-- 院校分数表格 -->
          <el-table :data="schoolScores" border stripe>
            <el-table-column prop="year" label="年份" width="100" />
            <el-table-column prop="batch" label="录取批次" width="120" />
            <el-table-column prop="type" label="招生类型" width="120" />
            <el-table-column label="最低分/最低位次" min-width="160">
              <template #default="{ row }">
                {{ row.minScore }}/{{ row.minRank }}
              </template>
            </el-table-column>
            <el-table-column prop="acceptRate" label="录取率" width="100" />
            <el-table-column prop="provinceLine" label="省控线" width="100" />
          </el-table>
        </el-tab-pane>

        <!-- 专业分数线 -->
        <el-tab-pane label="专业分数线" name="major">
          <!-- 专业分数查询条件 -->
          <div class="filter-section">
            <el-form :inline="true" :model="majorQuery">
              <el-form-item label="年份">
                <el-select v-model="majorQuery.year" class="filter-item">
                  <el-option label="2024" value="2024" />
                  <el-option label="2023" value="2023" />
                  <el-option label="2022" value="2022" />
                </el-select>
              </el-form-item>
              <el-form-item label="科类">
                <el-select v-model="majorQuery.type" class="filter-item">
                  <el-option label="理科" value="理科" />
                  <el-option label="文科" value="文科" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="queryMajorScores">查询</el-button>
                <el-button @click="resetMajorQuery">重置</el-button>
              </el-form-item>
            </el-form>
          </div>

          <!-- 专业分数趋势图 -->
          <div class="chart-section">
            <div class="chart-title">专业分数趋势</div>
            <div class="chart-wrapper">
              <v-chart :option="majorScoreChartOption" autoresize />
            </div>
          </div>

          <!-- 专业分数表格 -->
          <el-table :data="majorScores" border stripe>
            <el-table-column prop="year" label="年份" width="100" />
            <el-table-column prop="batch" label="录取批次" width="120" />
            <el-table-column prop="majorName" label="专业名称" min-width="180" />
            <el-table-column prop="type" label="招生类型" width="120" />
            <el-table-column label="最低分/最低位次" min-width="160">
              <template #default="{ row }">
                {{ row.minScore }}/{{ row.minRank }}
              </template>
            </el-table-column>
            <el-table-column prop="planNum" label="计划数" width="100" />
            <el-table-column prop="enrollNum" label="录取数" width="100" />
          </el-table>
        </el-tab-pane>

        <!-- 招生计划 -->
        <el-tab-pane label="招生计划" name="plan">
          <!-- 招生计划查询条件 -->
          <div class="filter-section">
            <el-form :inline="true" :model="planQuery">
              <el-form-item label="年份">
                <el-select v-model="planQuery.year" class="filter-item">
                  <el-option label="2024" value="2024" />
                </el-select>
              </el-form-item>
              <el-form-item label="科类">
                <el-select v-model="planQuery.type" class="filter-item">
                  <el-option label="理科" value="理科" />
                  <el-option label="文科" value="文科" />
                </el-select>
              </el-form-item>
              <el-form-item label="批次">
                <el-select v-model="planQuery.batch" class="filter-item">
                  <el-option label="本科一批" value="本科一批" />
                  <el-option label="本科二批" value="本科二批" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="queryEnrollmentPlans">查询</el-button>
                <el-button @click="resetPlanQuery">重置</el-button>
              </el-form-item>
            </el-form>
          </div>

          <!-- 招生计划趋势图 -->
          <div class="chart-section">
            <div class="chart-title">招生计划趋势</div>
            <div class="chart-wrapper">
              <v-chart :option="planChartOption" autoresize />
            </div>
          </div>

          <!-- 招生计划表格 -->
          <el-table :data="enrollmentPlans" border stripe>
            <el-table-column prop="majorName" label="专业名称" min-width="180" />
            <el-table-column prop="type" label="招生类型" width="120" />
            <el-table-column prop="planNum" label="计划数" width="100" />
            <el-table-column label="去年最低分/位次" min-width="160">
              <template #default="{ row }">
                {{ row.lastYearScore }}/{{ row.lastYearRank }}
              </template>
            </el-table-column>
            <el-table-column prop="notes" label="备注" min-width="150" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
  <div v-else class="loading-state">
    <el-empty description="加载中..." v-loading="true" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { 
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent 
} from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'
import { mockSchools } from './mock'
import SchoolCard from './components/SchoolCard.vue'

// 注册必要的 echarts 组件
echarts.use([
  CanvasRenderer,
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent
])

const route = useRoute()
const router = useRouter()

// 定义学校数据类型
interface School {
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
  lowestScore: number
  lowestRank: number
  enrollmentNum: number
  batch: string
  historyScores: Record<string, number>
}

// 学校数据
const school = ref<School | null>(null)

// 筛选条件
const selectedProvince = ref('陕西')
const selectedYear = ref('2024')
const selectedType = ref('理科')
const activeTab = ref('school')

// Mock 数据
const schoolScores = ref([
  {
    year: '2024',
    batch: '本科一批',
    type: '普通类',
    minScore: 574,
    minRank: 15282,
    acceptRate: '录取率',
    provinceLine: 475
  },
  {
    year: '2024',
    batch: '本科一批',
    type: '人工智能（中外合作办学）',
    minScore: 564,
    minRank: 18064,
    acceptRate: '录取率',
    provinceLine: 475
  },
  // ... 其他数据
])

const majorScores = ref([
  {
    year: '2024',
    batch: '本科一批',
    majorName: '计算机科学与技术',
    type: '普通类',
    minScore: 574,
    minRank: 15282,
    planNum: 120,
    enrollNum: 120
  },
  // ... 其他数据
])

const enrollmentPlans = ref([
  {
    majorName: '计算机科学与技术',
    type: '普通类',
    planNum: 120,
    lastYearScore: 574,
    lastYearRank: 15282,
    notes: '国家一流专业'
  },
  // ... 其他数据
])

// 查询条件
const schoolQuery = ref({
  year: '2024',
  type: '理科'
})

const majorQuery = ref({
  year: '2024',
  type: '理科'
})

const planQuery = ref({
  year: '2024',
  type: '理科',
  batch: '本科一批'
})

// 图表配置
const schoolScoreChartOption = ref({
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['最低分', '省控线']
  },
  xAxis: {
    type: 'category',
    data: ['2020', '2021', '2022', '2023', '2024']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '最低分',
      type: 'line',
      data: [665, 671, 675, 680, 682]
    },
    {
      name: '省控线',
      type: 'line',
      data: [460, 465, 470, 472, 475]
    }
  ]
})

// 查询方法
const querySchoolScores = () => {
  console.log('查询院校分数:', schoolQuery.value)
  // TODO: 实现查询逻辑
}

const queryMajorScores = () => {
  console.log('查询专业分数:', majorQuery.value)
  // TODO: 实现查询逻辑
}

const queryEnrollmentPlans = () => {
  console.log('查询招生计划:', planQuery.value)
  // TODO: 实现查询逻辑
}

// 重置方法
const resetSchoolQuery = () => {
  schoolQuery.value = {
    year: '2024',
    type: '理科'
  }
}

const resetMajorQuery = () => {
  majorQuery.value = {
    year: '2024',
    type: '理科'
  }
}

const resetPlanQuery = () => {
  planQuery.value = {
    year: '2024',
    type: '理科',
    batch: '本科一批'
  }
}

// 初始化学校数据
const initSchoolData = async () => {
  try {
    const schoolCode = route.params.code as string
    console.log('School Code:', schoolCode)
    const schoolData = mockSchools.find(s => s.code === schoolCode)
    console.log('School Data:', schoolData)
    
    if (schoolData) {
      // 确保在设置数据之前所有必要的字段都存在
      school.value = {
        name: schoolData.name,
        code: schoolData.code,
        logo: schoolData.logo,
        region: schoolData.region,
        features: schoolData.features,
        doctorPoints: schoolData.doctorPoints,
        masterPoints: schoolData.masterPoints,
        website: schoolData.website,
        phone: schoolData.phone,
        email: schoolData.email,
        subjects: schoolData.subjects,
        lowestScore: schoolData.lowestScore,
        lowestRank: schoolData.lowestRank,
        enrollmentNum: schoolData.enrollmentNum,
        batch: schoolData.batch,
        historyScores: schoolData.historyScores
      }
    } else {
      console.warn('School not found')
      ElMessage.error('未找到学校信息')
      router.push('/school')
    }
  } catch (error) {
    console.error('Error loading school data:', error)
    ElMessage.error('加载学校信息失败')
    router.push('/school')
  }
}

// 组件挂载时初始化数据
onMounted(() => {
  initSchoolData()
})
</script>

<style scoped>
.school-detail-layout {
  padding: 24px;
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 24px;
  min-height: calc(100vh - 60px);
  background: #f5f7fa;
}

.left-panel {
  position: sticky;
  top: 24px;
  height: fit-content;
}

.right-panel {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
}

.filter-section {
  margin-bottom: 24px;
  h2 {
    margin: 0 0 16px 0;
    font-size: 20px;
    color: #2c3e50;
  }
}

.filters {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.filter-item {
  width: 160px;
}

.score-tabs {
  :deep(.el-tabs__content) {
    padding: 20px 0;
  }
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  margin: 24px;
}

.chart-section {
  margin: 24px 0;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.chart-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #2c3e50;
}

.chart-wrapper {
  height: 300px;
  background: #fff;
  padding: 16px;
  border-radius: 8px;
}

:deep(.echarts) {
  width: 100%;
  height: 100%;
}
</style> 