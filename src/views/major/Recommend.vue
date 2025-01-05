<template>
  <div class="recommend-container">
    <!-- 筛选区域 -->
    <div class="filter-section">
      <div class="filter-row">
        <!-- 院校地区选择 -->
        <el-popover
          v-model:visible="showRegionPopover"
          placement="bottom-start"
          :width="800"
          trigger="click"
        >
          <template #reference>
            <div class="filter-item">
              <span class="label">院校地区</span>
              <el-input
                readonly
                :placeholder="getSelectedRegionsText()"
                @click="showRegionPopover = true"
              >
                <template #suffix>
                  <el-icon><ArrowDown /></el-icon>
                </template>
              </el-input>
            </div>
          </template>
          
          <!-- 地区选择内容 -->
          <div class="region-options">
            <el-checkbox 
              v-model="filterForm.allRegions" 
              @change="handleAllRegionsChange"
            >
              不限
            </el-checkbox>
            <el-checkbox-group 
              v-model="filterForm.selectedRegions"
              @change="handleRegionChange"
            >
              <el-checkbox 
                v-for="area in areaOptions" 
                :key="area.id" 
                :label="area.name"
              >
                {{ area.name }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </el-popover>

        <!-- 专业类别选择 -->
        <el-popover
          v-model:visible="showMajorPopover"
          placement="bottom-start"
          :width="800"
          trigger="click"
        >
          <template #reference>
            <div class="filter-item">
              <span class="label">专业类别</span>
              <el-input
                readonly
                :placeholder="getSelectedMajorsText()"
                @click="showMajorPopover = true"
              >
                <template #suffix>
                  <el-icon><ArrowDown /></el-icon>
                </template>
              </el-input>
            </div>
          </template>
          
          <!-- 专业选择内容 -->
          <div class="major-options">
            <!-- 顶部导航 -->
            <div class="major-nav">
              <div 
                v-for="major in topMajors" 
                :key="major.id"
                :class="['nav-item', { active: major.id === currentTopMajor }]"
                @click="currentTopMajor = major.id"
              >
                {{ major.name }}
              </div>
            </div>
            
            <!-- 专业分类内容区 -->
            <div class="major-content">
              <div class="category-list">
                <div 
                  v-for="category in currentCategories" 
                  :key="category.id"
                  :class="['category-item', { active: category.id === currentCategory }]"
                  @click="currentCategory = category.id"
                >
                  {{ category.name }}
                </div>
              </div>
              
              <div class="major-list">
                <el-checkbox 
                  v-model="filterForm.allMajors"
                  @change="handleAllMajorsChange"
                >
                  全选
                </el-checkbox>
                <el-checkbox-group 
                  v-model="filterForm.selectedMajors"
                  @change="handleMajorChange"
                >
                  <el-checkbox 
                    v-for="major in currentMajorList" 
                    :key="major.id" 
                    :label="major.id"
                  >
                    {{ major.name }}
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
          </div>
        </el-popover>

        <!-- 院校类型选择 -->
        <div class="filter-item">
          <span class="label">院校类型</span>
          <el-select v-model="filterForm.type" placeholder="请选择">
            <el-option label="不限" value="" />
            <el-option label="985" value="985" />
            <el-option label="211" value="211" />
            <el-option label="双一流" value="双一流" />
          </el-select>
        </div>

        <!-- 院校搜索 -->
        <div class="filter-item search-item">
          <el-input
            v-model="filterForm.search"
            placeholder="请输入院校名称"
            clearable
          >
            <template #append>
              <el-button type="primary" @click="handleSearch">
                搜索
              </el-button>
            </template>
          </el-input>
        </div>
      </div>
    </div>

    <!-- 推荐学校列表 -->
    <div class="university-list">
      <!-- 筛选统计 -->
      <div class="filter-stats">
        <div class="stats-left">
          <span>全部 {{ total }}</span>
          <span>可冲击 {{ rushCount }}</span>
          <span>较稳妥 {{ stableCount }}</span>
          <span>可保底 {{ safeCount }}</span>
        </div>
        <div class="stats-right">
          <div class="score-filter">
            <el-checkbox v-model="onlyShowScore" :default-checked="true">
              只看推荐分数
            </el-checkbox>
            <div class="score-slider">
              <el-slider
                v-model="scoreRange"
                range
                :min="minPossibleScore"
                :max="maxPossibleScore"
                :step="1"
                :show-stops="false"
                :format-tooltip="formatScore"
                @change="handleScoreRangeChange"
              />
              <div class="score-labels">
                <span>{{ scoreRange[0] }}</span>
                <span>-</span>
                <span>{{ scoreRange[1] }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 学校列表 -->
      <div class="university-items">
        <div class="university-item" v-for="uni in mockUniversities" :key="uni.id">
          <div class="uni-header">
            <div class="uni-logo">
              <img :src="uni.logo" :alt="uni.name">
            </div>
            <div class="uni-info">
              <h3 class="uni-name">{{ uni.name }}</h3>
              <div class="uni-meta">
                <span>{{ uni.code }}</span>
                <span v-if="uni.acceptRate" class="accept-rate">保 {{ uni.acceptRate }}%</span>
              </div>
            </div>
          </div>
          <div class="uni-tags">
            <span class="tag-item">{{ uni.province }}</span>
            <span class="tag-item">{{ uni.type }}</span>
            <span class="tag-item" v-if="uni.is985">985</span>
            <span class="tag-item" v-if="uni.is211">211</span>
            <span class="tag-item" v-if="uni.isDoubleFirst">双一流</span>
            <span class="tag-item">{{ uni.category }}</span>
            <span class="tag-item">{{ uni.department }}</span>
          </div>
          <div class="uni-scores">
            <div class="score-year" v-for="score in uni.scores" :key="score.year">
              <div class="year">{{ score.year }}年</div>
              <div class="score-info">
                <div>招生人数 {{ score.planCount }}名</div>
                <div>最低分 {{ score.minScore }}分</div>
                <div>最低位次 {{ score.minRank }}名</div>
                <div>比我的位次 {{ score.rankDiff }}</div>
                <div>同位分 {{ score.sameScore }}分</div>
                <div>比我分数 {{ score.scoreDiff }}</div>
              </div>
            </div>
          </div>
          <div class="uni-actions">
            <el-button type="primary" plain size="small">可填专业({{ uni.majorCount }})</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import areaOptionsJson from '@/config/area-option.json'
import majorListJson from '@/config/majorList.json'

// 区域数据
const areaOptions = computed(() => {
  return areaOptionsJson.body || []
})

// 专业大类数据
const topMajors = computed(() => {
  return majorListJson.body || []
})

// 当前选中的专业大类
const currentTopMajor = ref('')
// 当前选中的专业分类
const currentCategory = ref('')

// 筛选表单
const filterForm = reactive({
  // 地区相关
  allRegions: true,
  selectedRegions: [] as string[],
  // 专业相关
  allMajors: true,
  selectedMajors: [] as string[],
  // 院校类型
  type: '',
  // 搜索关键词
  search: ''
})

// 获取选中地区的显示文本
const getSelectedRegionsText = () => {
  if (filterForm.allRegions) return '请选择'
  if (filterForm.selectedRegions.length === 0) return '请选择'
  
  const selectedNames = filterForm.selectedRegions.map(region => {
    const area = areaOptions.value.find(a => a.name === region)
    return area?.name || ''
  }).filter(Boolean)

  if (selectedNames.length <= 2) {
    return selectedNames.join('、')
  }
  return `${selectedNames[0]}、${selectedNames[1]} 等${selectedNames.length}个地区`
}

// 获取当前大类下的所有分类
const currentCategories = computed(() => {
  const topMajor = majorListJson.body.find(m => m.id === currentTopMajor.value)
  return topMajor?.children || []
})

// 获取当前分类下的专业列表
const currentMajorList = computed(() => {
  if (!currentCategory.value) return []
  
  const category = currentCategories.value.find(c => c.id === currentCategory.value)
  return category?.children || []
})

// 获取选中专业的显示文本
const getSelectedMajorsText = () => {
  if (!filterForm?.selectedMajors) return '请选择'
  if (filterForm.allMajors) return '请选择'
  if (filterForm.selectedMajors.length === 0) return '请选择'
  
  const selectedNames = filterForm.selectedMajors.map(id => {
    const major = findMajorById(id)
    return major?.name || ''
  }).filter(Boolean)

  if (selectedNames.length <= 2) {
    return selectedNames.join('、')
  }
  return `${selectedNames[0]}、${selectedNames[1]} 等${selectedNames.length}个专业`
}

// 根据ID查找专业
const findMajorById = (id: string) => {
  for (const topMajor of majorListJson.body) {
    if (topMajor.children) {
      for (const category of topMajor.children) {
        if (category.children) {
          const major = category.children.find(m => m.id === id)
          if (major) return major
        }
      }
    }
  }
  return null
}

// 处理地区"不限"选项变化
const handleAllRegionsChange = (val: boolean) => {
  if (val) {
    filterForm.selectedRegions = []
  }
}

// 处理地区选择变化
const handleRegionChange = (val: string[]) => {
  filterForm.allRegions = val.length === 0
}

// 处理专业"不限"选项变化
const handleAllMajorsChange = (val: boolean) => {
  if (val) {
    filterForm.selectedMajors = []
  }
}

// 处理专业选择变化
const handleMajorChange = (val: string[]) => {
  filterForm.allMajors = val.length === 0
}

// 搜索处理
const handleSearch = () => {
  console.log('搜索条件:', filterForm)
}

// 控制弹出框显示
const showRegionPopover = ref(false)
const showMajorPopover = ref(false)

// Mock 数据
const mockUniversities = ref([
  {
    id: '1',
    name: '南京大学',
    logo: 'https://example.com/logo.png', // 需要替换为实际logo
    code: '3001',
    acceptRate: 20,
    province: '江苏',
    type: '综合',
    is985: true,
    is211: true,
    isDoubleFirst: true,
    category: '公办',
    department: '教育部直属',
    majorCount: 17,
    scores: [
      {
        year: '2024',
        planCount: 52,
        minScore: 674,
        minRank: 592,
        rankDiff: '靠前365名',
        sameScore: 674,
        scoreDiff: '高8分'
      },
      {
        year: '2023',
        planCount: 43,
        minScore: 676,
        minRank: 431,
        rankDiff: '靠前526名',
        sameScore: 677,
        scoreDiff: '高11分'
      },
      {
        year: '2022',
        planCount: 43,
        minScore: 651,
        minRank: 727,
        rankDiff: '靠前230名',
        sameScore: 670,
        scoreDiff: '高4分'
      }
    ]
  }
  // 可以添加更多学校数据...
])

// 统计数据
const total = ref(29)
const rushCount = ref(6)
const stableCount = ref(10)
const safeCount = ref(13)
const onlyShowScore = ref(true)
const minScore = ref(631)
const maxScore = ref(676)

// 分数范围相关
const minPossibleScore = ref(400)
const maxPossibleScore = ref(750)
const scoreRange = ref([631, 676])

// 格式化分数显示
const formatScore = (val: number) => {
  return `${val}分`
}

// 处理分数范围变化
const handleScoreRangeChange = (val: [number, number]) => {
  // 这里可以触发重新请求数据
  console.log('分数范围变化:', val)
}

// 监听只看推荐分数变化
watch(onlyShowScore, (newVal) => {
  if (newVal) {
    // 当开启只看推荐分数时，可以触发相关逻辑
    handleScoreRangeChange(scoreRange.value)
  }
})

// 初始化
onMounted(() => {
  // 设置默认显示第一个专业大类
  if (topMajors.value.length > 0) {
    currentTopMajor.value = topMajors.value[0].id
    // 设置默认选中第一个分类
    if (currentCategories.value.length > 0) {
      currentCategory.value = currentCategories.value[0].id
    }
  }
})
</script>

<style scoped lang="scss">
.recommend-container {
  padding: 20px;
  background: #f5f7fa;
}

.filter-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.filter-item {
  display: flex;
  align-items: center;
  
  .label {
    white-space: nowrap;
    margin-right: 8px;
    color: #606266;
    font-size: 14px;
  }
  
  .el-input,
  .el-select {
    width: 180px;
  }
}

.search-item {
  flex: 1;
  margin-left: auto;
  
  .el-input {
    width: 300px;
  }
}

:deep(.el-input__wrapper) {
  border-radius: 4px;
}

:deep(.el-input-group__append) {
  .el-button {
    border: none;
    margin: -12px;
    height: 32px;
    padding: 8px 16px;
  }
}

// 保持原有的弹出框样式
.major-options {
  .major-nav {
    display: flex;
    overflow-x: auto;
    border-bottom: 1px solid #EBEEF5;
    margin-bottom: 16px;
    
    .nav-item {
      padding: 8px 16px;
      cursor: pointer;
      white-space: nowrap;
      
      &.active {
        color: #f87b46;
        position: relative;
        
        &::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: #f87b46;
        }
      }
      
      &:hover {
        color: #f87b46;
      }
    }
  }

  .major-content {
    display: flex;
    height: 400px;
    
    .category-list {
      width: 200px;
      border-right: 1px solid #EBEEF5;
      overflow-y: auto;
      
      .category-item {
        padding: 12px 16px;
        cursor: pointer;
        
        &:hover {
          background-color: #f5f7fa;
        }
        
        &.active {
          color: #f87b46;
          background-color: #fff7f5;
          border-left: 2px solid #f87b46;
        }
      }
    }
    
    .major-list {
      flex: 1;
      padding: 0 16px;
      overflow-y: auto;
      
      .el-checkbox {
        display: block;
        margin-right: 0;
        margin-bottom: 12px;
        
        &:first-child {
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid #EBEEF5;
        }
      }
      
      .el-checkbox-group {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
    }
  }
}

.region-options {
  padding: 16px;
  
  .el-checkbox-group {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 12px;
    margin-top: 12px;
  }
}

.university-list {
  margin-top: 20px;
  background: white;
  border-radius: 8px;
  padding: 20px;

  .filter-stats {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    .stats-left {
      span {
        margin-right: 20px;
        &:first-child {
          font-weight: bold;
        }
      }
    }
    
    .stats-right {
      display: flex;
      align-items: center;
      gap: 16px;
      
      .score-filter {
        display: flex;
        align-items: center;
        gap: 16px;

        .score-slider {
          width: 200px;
          margin-left: 16px;
          
          .el-slider {
            margin-bottom: 4px;
          }

          .score-labels {
            display: flex;
            justify-content: space-between;
            color: #f87b46;
            font-size: 14px;
          }
        }
      }
    }
  }

  .university-items {
    .university-item {
      border: 1px solid #EBEEF5;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 16px;

      .uni-header {
        display: flex;
        gap: 16px;
        margin-bottom: 12px;

        .uni-logo {
          width: 48px;
          height: 48px;
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 4px;
          }
        }

        .uni-info {
          .uni-name {
            margin: 0 0 4px;
            font-size: 18px;
          }

          .uni-meta {
            color: #666;
            font-size: 14px;
            
            .accept-rate {
              margin-left: 16px;
              color: #f87b46;
            }
          }
        }
      }

      .uni-tags {
        margin-bottom: 12px;
        
        .tag-item {
          display: inline-block;
          padding: 2px 8px;
          margin: 0 8px 8px 0;
          background: #f5f7fa;
          border-radius: 4px;
          font-size: 12px;
          color: #666;
        }
      }

      .uni-scores {
        display: flex;
        gap: 20px;
        margin-bottom: 16px;
        
        .score-year {
          flex: 1;
          
          .year {
            font-weight: bold;
            margin-bottom: 8px;
          }
          
          .score-info {
            font-size: 14px;
            color: #666;
            
            > div {
              margin-bottom: 4px;
            }
          }
        }
      }

      .uni-actions {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}

:deep(.el-slider) {
  .el-slider__runway {
    margin: 8px 0;
  }
  
  .el-slider__bar {
    background-color: #f87b46;
  }
  
  .el-slider__button {
    border-color: #f87b46;
  }
}

.score-filter {
  display: flex;
  align-items: center;
  gap: 16px;

  .score-slider {
    width: 200px;
    margin-left: 16px;
    
    .el-slider {
      margin-bottom: 4px;
    }

    .score-labels {
      display: flex;
      justify-content: space-between;
      color: #f87b46;
      font-size: 14px;
    }
  }
}
</style> 