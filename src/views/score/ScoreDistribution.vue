<template>
  <div class="score-distribution-page">
    <!-- 添加全局loading -->
    <el-loading 
      v-if="loading"
      :fullscreen="true" 
      text="加载中..."
    />
    
    <!-- 筛选条件区域 -->
    <el-card class="filter-card">
      <el-form :model="filterForm" inline>
        <!-- 所在地区 -->
        <el-form-item label="所在地区">
          <div class="region-options">
            <el-tag 
              v-for="province in provinces" 
              :key="province"
              :class="{ active: filterForm.province === province }"
              @click="filterForm.province = province"
              :effect="filterForm.province === province ? 'dark' : 'plain'"
            >
              {{ province }}
            </el-tag>
          </div>
        </el-form-item>
        
        <!-- 年份 -->
        <el-form-item label="年份">
          <div class="year-options">
            <el-tag 
              v-for="year in years" 
              :key="year"
              :class="{ active: filterForm.year === year }"
              @click="filterForm.year = year"
              :effect="filterForm.year === year ? 'dark' : 'plain'"
            >
              {{ year }}
            </el-tag>
          </div>
        </el-form-item>
        
        <!-- 考生类别 -->
        <el-form-item label="考生类别">
          <div class="type-options">
            <el-tag 
              v-for="type in ['理科', '文科']" 
              :key="type"
              :class="{ active: filterForm.examType === type }"
              @click="filterForm.examType = type"
              :effect="filterForm.examType === type ? 'dark' : 'plain'"
            >
              {{ type }}
            </el-tag>
          </div>
        </el-form-item>

        <!-- 分数输入和查询 -->
        <div class="search-area">
          <el-input 
            v-model="filterForm.score" 
            placeholder="请输入分数"
            style="width: 200px"
          />
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </div>
      </el-form>
    </el-card>

    <!-- 分数信息展示 - 只在有分数时显示 -->
    <el-card v-if="showScoreInfo" class="score-info-card" v-loading="loading">
      <div class="score-info">
        <div class="info-item">
          <div class="label">高考分数</div>
          <div class="value">{{ filterForm.score }}分</div>
        </div>
        <div class="info-item">
          <div class="label">{{ currentBatchName }}</div>
          <div class="value">{{ batchScore }}分</div>
        </div>
        <div class="info-item">
          <div class="label">同分人数</div>
          <div class="value">{{ sameScorePeople }}人</div>
        </div>
        <div class="info-item">
          <div class="label">排名区间</div>
          <div class="value">{{ rankRange }}名</div>
        </div>
      </div>
    </el-card>

    <!-- 分数分布图 -->
    <el-card class="chart-card" v-loading="loading">
      <div class="chart-container" ref="chartRef"></div>
    </el-card>

    <!-- 历史位次信息 - 只在有分数时显示 -->
    <el-card v-if="showScoreInfo && hasHistoryScores" class="history-card">
      <div class="history-title">历史同位次考生得分</div>
      <div class="history-list">
        <div v-for="(score, year) in historyScores" :key="year" class="history-item">
          <span>{{ year }}年</span>
          <span>{{ score }}分</span>
        </div>
      </div>
    </el-card>

    <!-- 一分一段表格 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span class="title">一分一段表</span>
          <div class="header-right">
            <el-input
              v-model="searchScore"
              placeholder="搜索分数"
              style="width: 200px"
              clearable
            />
          </div>
        </div>
      </template>
      
      <el-table 
        :data="pagedScoreRanks" 
        stripe 
        style="width: 100%"
        height="500"
      >
        <el-table-column prop="score" label="分数" width="180" align="center" />
        <el-table-column prop="count" label="本段人数" width="180" align="center" />
        <el-table-column prop="accumulate" label="累计人数" align="center" />
      </el-table>
      
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="filteredScoreRanks.length"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { scoreCache } from '@/utils/cache'

// 添加加载状态
const loading = ref(false)

// 省份列表 - 按图片顺序排列
const provinces = [
  '北京', '天津', '河北', '山西', '内蒙古', '辽宁', '吉林', '黑龙江', 
  '上海', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', 
  '湖北', '湖南', '广东', '广西', '海南', '重庆', '四川', '贵州', 
  '云南', '陕西', '甘肃', '青海', '宁夏'
]

// 年份列表 - 2016-2024
const years = [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2016]

// 筛选表单 - 修改默认值
const filterForm = ref({
  province: '陕西', // 默认选中陕西省
  year: 2024,
  examType: '理科',
  score: ''
})

// 是否显示分数信息
const showScoreInfo = computed(() => !!filterForm.value.score)

// 图表相关
const chartRef = ref<HTMLElement>()
const chartType = ref('line')
let chart: echarts.ECharts | null = null

// 用户信息
const userStore = useUserStore()
const userScore = computed(() => userStore.userInfo?.score)

// 模拟数据
const batchScore = ref(475)
const sameScorePeople = ref(52)
const rankRange = ref('906-957')
const historyScores = ref({
  '2023': 659,
  '2022': 644,
  '2021': 652
})

// 搜索分数
const searchScore = ref('')

// 一分一段数据
const scoreRanks = ref([
  { score: 750, count: 12, accumulate: 12 },
  { score: 711, count: 2, accumulate: 14 },
  { score: 710, count: 0, accumulate: 14 },
  // ... 更多数据
])

// 过滤后的数据
const filteredScoreRanks = computed(() => {
  if (!searchScore.value) return scoreRanks.value
  
  return scoreRanks.value.filter(item => 
    item.score.toString().includes(searchScore.value)
  )
})

// 定义数据类型
interface ScoreData {
  score: string
  num: string
  total: string
  rank_range: string
  batch_name: string
  controlscore: string
  appositive_fraction: Array<{
    year: number
    score: string
    rank_range: string
  }>
  rank: string
}

interface ScoreDistData {
  data: {
    search: Record<string, ScoreData>
    list: Array<{
      score: string
      num: string
      total: string
    }>
  }
}

// 存储原始数据
const data = ref<ScoreDistData | null>(null)

// 获取分数数据
const getScoreData = async (year: number, type: number, score: string) => {
  // 生成缓存key
  const cacheKey = `score_${year}_${type}_${score}`
  
  try {
    loading.value = true
    
    // 尝试从缓存获取数据
    const cachedData = scoreCache.get(cacheKey)
    if (cachedData) {
      handleScoreData(cachedData)
      return
    }
    
    const response = await import(`@/config/scoredist/${year}/${type}/scoredist.json`)
    const data: ScoreDistData = response.default
    
    try {
      // 尝试缓存数据
      scoreCache.set(cacheKey, data)
    } catch (error) {
      console.warn('缓存数据失败:', error)
      // 缓存失败不影响功能继续使用
    }
    
    handleScoreData(data)
  } catch (error) {
    console.error('获取分数数据失败:', error)
    ElMessage.error({
      message: '获取分数数据失败,请稍后重试',
      duration: 3000,
      showClose: true
    })
  } finally {
    loading.value = false
  }
}

// 处理分数数据
const handleScoreData = (responseData: ScoreDistData) => {
  // 保存原始数据
  data.value = responseData
  
  // 设置一分一段表数据
  scoreRanks.value = responseData.data.list.map(item => ({
    score: item.score,
    count: parseInt(item.num),
    accumulate: parseInt(item.total)
  }))

  if (filterForm.value.score) {
    const searchData = responseData.data.search[filterForm.value.score]
    if (searchData) {
      // 设置基本信息
      batchScore.value = parseInt(searchData.controlscore)
      currentBatchName.value = searchData.batch_name
      sameScorePeople.value = parseInt(searchData.num)
      rankRange.value = searchData.rank_range
      
      // 设置历史同位次数据
      historyScores.value = searchData.appositive_fraction.reduce((acc, cur) => {
        acc[cur.year] = parseInt(cur.score)
        return acc
      }, {} as Record<number, number>)
    } else {
      // 清空数据
      clearScoreInfo()
    }
  } else {
    clearScoreInfo()
  }
  
  // 重新渲染图表
  initChart()
}

// 清空分数信息
const clearScoreInfo = () => {
  batchScore.value = 0
  currentBatchName.value = ''
  sameScorePeople.value = 0
  rankRange.value = ''
  historyScores.value = {}
}

// 优化图表配置
const initChart = () => {
  if (!chartRef.value) return
  
  if (chart) {
    chart.dispose()
  }
  
  chart = echarts.init(chartRef.value)
  
  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      formatter: function(params: any) {
        const score = params[0].axisValue
        const searchData = scoreRanks.value.find(item => item.score === score)
        
        if (!searchData) return params[0].value

        // 获取该分数对应的详细信息
        const scoreData = data.value?.data.search[score]
        if (!scoreData) return params[0].value

        const historyScoreText = scoreData.appositive_fraction
          .map(item => `${item.score}分 (${item.year})`)
          .join('<br/>')
        
        return `
          <div class="chart-tooltip">
            <div class="tooltip-title">分数详情</div>
            <div class="tooltip-item">
              <span class="label">分数:</span>
              <span class="value">${score}分</span>
            </div>
            <div class="tooltip-item">
              <span class="label">${scoreData.batch_name}:</span>
              <span class="value">${scoreData.controlscore}分</span>
            </div>
            <div class="tooltip-item">
              <span class="label">同分人数:</span>
              <span class="value">${scoreData.num}人</span>
            </div>
            <div class="tooltip-item">
              <span class="label">排名区间:</span>
              <span class="value">${scoreData.rank_range}名</span>
            </div>
            <div class="tooltip-title">历史同位次</div>
            ${historyScoreText}
          </div>
        `
      }
    },
    grid: {
      top: 60,
      right: 60,
      bottom: 100,
      left: 60
    },
    xAxis: {
      type: 'category',
      data: scoreRanks.value.map(item => item.score),
      name: '分数',
      nameLocation: 'middle',
      nameGap: 30,
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      name: '人数',
      nameLocation: 'middle',
      nameGap: 40
    },
    series: [
      {
        data: scoreRanks.value.map(item => item.count),
        type: 'line',
        smooth: true,
        markLine: filterForm.value.score ? {
          data: [
            {
              name: '高考分数',
              xAxis: filterForm.value.score,
              label: {
                formatter: '高考分数: {c}分'
              }
            },
            {
              name: currentBatchName.value,
              xAxis: batchScore.value,
              label: {
                formatter: `${currentBatchName.value}: {c}分`
              }
            }
          ]
        } : undefined,
        markPoint: filterForm.value.score ? {
          data: [
            {
              name: '当前分数',
              coord: [filterForm.value.score, 0],
              value: filterForm.value.score,
              itemStyle: {
                color: '#f56c6c'
              }
            }
          ]
        } : undefined,
        areaStyle: {
          opacity: 0.3
        }
      }
    ]
  }
  
  chart.setOption(option)
}

// 处理搜索
const handleSearch = () => {
  if (!filterForm.value.score) {
    ElMessage.warning('请输入分数')
    return
  }
  
  const type = filterForm.value.examType === '理科' ? 1 : 2
  getScoreData(filterForm.value.year, type, filterForm.value.score)
}

// 监听年份和类别变化
watch([
  () => filterForm.value.year,
  () => filterForm.value.examType,
  () => filterForm.value.province
], () => {
  // 每次条件变化都重新获取数据
  const type = filterForm.value.examType === '理科' ? 1 : 2
  getScoreData(filterForm.value.year, type, filterForm.value.score)
}, { immediate: true }) // 添加 immediate: true 以确保初始加载

// 监听分数变化重新渲染图表
watch(() => filterForm.value.score, () => {
  if (filterForm.value.score) {
    initChart()
  }
})

// 处理测录取概率
const handleProbability = () => {
  if (!filterForm.value.score) {
    ElMessage.warning('请输入分数')
    return
  }
  // TODO: 跳转到录取概率页面
}

// 监听图表类型变化
watch(chartType, () => {
  initChart()
})

// 批次名称
const currentBatchName = ref('')

// 分页相关
const currentPage = ref(1)
const pageSize = ref(20)

// 分页后的数据
const pagedScoreRanks = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredScoreRanks.value.slice(start, end)
})

// 是否有历史分数
const hasHistoryScores = computed(() => {
  return Object.keys(historyScores.value).length > 0
})

// 处理分页大小变化
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
}

// 处理页码变化
const handleCurrentChange = (val: number) => {
  currentPage.value = val
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', () => chart?.resize())
})

onUnmounted(() => {
  window.removeEventListener('resize', () => chart?.resize())
  chart?.dispose()
})
</script>

<style scoped>
.score-distribution-page {
  padding: 24px;
  background: #f5f7fa;
  min-height: calc(100vh - 60px);
}

/* 卡片样式优化 */
.filter-card,
.score-info-card,
.chart-card,
.history-card,
.table-card {
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 4px 16px 0 rgba(0,0,0,0.1);
  }
}

/* 分数信息展示优化 */
.score-info {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  padding: 8px;
}

.info-item {
  text-align: center;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px 0 rgba(0,0,0,0.1);
  }
  
  .label {
    color: #909399;
    font-size: 15px;
    margin-bottom: 12px;
  }
  
  .value {
    font-size: 28px;
    font-weight: bold;
    background: linear-gradient(45deg, #409EFF, #36D1DC);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

/* 图表容器优化 */
.chart-container {
  height: 500px;
  width: 100%;
  background: #fff;
  padding: 24px;
  border-radius: 8px;
}

/* 历史同位次样式优化 */
.history-card {
  background: linear-gradient(135deg, #fff, #f8f9fa);
}

.history-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 24px;
  color: #303133;
  padding-bottom: 12px;
  border-bottom: 2px solid #ebeef5;
}

.history-list {
  display: flex;
  gap: 24px;
  padding: 8px;
}

.history-item {
  padding: 20px 30px;
  background: #fff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px 0 rgba(0,0,0,0.1);
  }
  
  span:first-child {
    color: #909399;
    font-size: 15px;
  }
  
  span:last-child {
    font-size: 24px;
    font-weight: bold;
    color: #409EFF;
  }
}

/* 表格样式优化 */
.table-card {
  .card-header {
    padding: 16px 20px;
    border-bottom: 1px solid #ebeef5;
    
    .title {
      font-size: 18px;
      font-weight: bold;
      color: #303133;
      position: relative;
      padding-left: 12px;
      
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 16px;
        background: #409EFF;
        border-radius: 2px;
      }
    }
  }
}

/* 分页器样式优化 */
.pagination-container {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

/* 标签样式优化 */
:deep(.el-tag) {
  cursor: pointer;
  margin: 4px;
  transition: all 0.3s ease;
  border-radius: 4px;
  
  &.active {
    background: linear-gradient(45deg, #409EFF, #36D1DC);
    border: none;
    
    &:hover {
      opacity: 0.9;
    }
  }
  
  &:not(.active):hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px 0 rgba(0,0,0,0.1);
  }
}

/* 搜索区域优化 */
.search-area {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  
  .el-input {
    .el-input__wrapper {
      box-shadow: 0 2px 8px 0 rgba(0,0,0,0.05);
    }
  }
  
  .el-button {
    padding: 12px 24px;
    font-weight: bold;
  }
}

/* 表格内容优化 */
:deep(.el-table) {
  border-radius: 8px;
  overflow: hidden;
  
  th {
    background-color: #f5f7fa !important;
    font-weight: bold;
    color: #303133;
  }
  
  td {
    padding: 16px 0;
  }
  
  .el-table__row {
    transition: all 0.3s ease;
    
    &:hover {
      background-color: #f5f7fa !important;
    }
  }
}
</style> 