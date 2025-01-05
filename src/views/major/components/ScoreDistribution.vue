<template>
  <div class="score-distribution">
    <!-- 1. 基本信息展示 -->
    <div class="score-info">
      <div class="info-item">
        <span class="label">高考分数:</span>
        <span class="value">{{ score }}分</span>
      </div>
      <div class="info-item">
        <span class="label">本科一批:</span>
        <span class="value">{{ batchScore }}分</span>
      </div>
      <div class="info-item">
        <span class="label">同分人数:</span>
        <span class="value">{{ sameScorePeople }}人</span>
      </div>
      <div class="info-item">
        <span class="label">排名区间:</span>
        <span class="value">{{ rankRange }}名</span>
      </div>
    </div>

    <!-- 2. 分数分布图 -->
    <div class="distribution-chart">
      <div class="chart-title">分数分布图</div>
      <div class="chart-container" ref="chartRef"></div>
    </div>

    <!-- 3. 历年位次信息 -->
    <div class="history-rank">
      <div class="history-title">历史同位次考生得分</div>
      <div class="history-list">
        <div v-for="(score, year) in historyScores" :key="year" class="history-item">
          <span>{{ year }}年</span>
          <span>{{ score }}分</span>
        </div>
      </div>
    </div>

    <!-- 4. 一分一段表 -->
    <div class="score-table">
      <el-table :data="scoreRanks" stripe style="width: 100%">
        <el-table-column prop="score" label="分数" width="180" />
        <el-table-column prop="count" label="本段人数" width="180" />
        <el-table-column prop="accumulate" label="累计人数" />
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

interface Props {
  score: number
  batchScore: number
  sameScorePeople: number
  rankRange: string
  historyScores: Record<string, number>
  scoreRanks: Array<{
    score: number
    count: number
    accumulate: number
  }>
}

const props = defineProps<Props>()
const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

const initChart = () => {
  if (!chartRef.value) return
  
  // 如果已经存在图表实例，先销毁
  if (chart) {
    chart.dispose()
  }
  
  chart = echarts.init(chartRef.value)
  const scores = props.scoreRanks.map(item => item.score)
  const counts = props.scoreRanks.map(item => item.count)
  
  const option: EChartsOption = {
    grid: {
      top: 40,
      right: 40,
      bottom: 60,
      left: 60
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      data: scores,
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
    series: [{
      data: counts,
      type: 'line',
      smooth: true,
      markPoint: {
        data: [{
          type: 'max',
          name: '最大值'
        }]
      },
      markLine: {
        data: [{
          type: 'average',
          name: '平均值'
        }]
      },
      areaStyle: {
        opacity: 0.3
      }
    }]
  }
  
  chart.setOption(option)
}

// 优化响应式调整
const handleResize = () => {
  chart?.resize()
}

// 监听数据变化更新图表
watch(() => props.scoreRanks, () => {
  if (chart) {
    initChart()
  }
}, { deep: true })

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

// 组件销毁时清理
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (chart) {
    chart.dispose()
    chart = null
  }
})
</script>

<style scoped>
.score-distribution {
  padding: 20px;
}

.score-info {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.info-item {
  text-align: center;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 4px;
}

.label {
  color: #909399;
  margin-right: 8px;
}

.value {
  font-size: 18px;
  font-weight: bold;
  color: #409eff;
}

.distribution-chart {
  margin-bottom: 30px;
}

.chart-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
}

.chart-container {
  height: 400px;
  width: 100%;
}

.history-rank {
  margin-bottom: 30px;
}

.history-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
}

.history-list {
  display: flex;
  gap: 20px;
}

.history-item {
  padding: 10px 20px;
  background: #f5f7fa;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.score-table {
  margin-top: 20px;
}
</style> 