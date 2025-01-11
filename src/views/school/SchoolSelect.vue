<template>
  <div class="school-select-page">
    <!-- 搜索和筛选区域 -->
    <el-card class="filter-card">
      <div class="search-section">
        <el-autocomplete
          v-model="searchForm.keyword"
          :fetch-suggestions="querySchools"
          placeholder="请输入学校名称"
          class="search-input"
          @select="handleSelect"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-autocomplete>
      </div>

      <div class="filter-section">
        <!-- 院校地区 -->
        <div class="filter-group">
          <div class="filter-label">院校地区</div>
          <div class="filter-content">
            <el-tag
              v-for="region in regions"
              :key="region"
              :class="{ active: searchForm.region === region }"
              @click="searchForm.region = region"
              :effect="searchForm.region === region ? 'dark' : 'plain'"
            >
              {{ region }}
            </el-tag>
          </div>
        </div>

        <!-- 院校特色 -->
        <div class="filter-group">
          <div class="filter-label">院校特色</div>
          <div class="filter-content">
            <el-tag
              v-for="feature in features"
              :key="feature.value"
              :class="{ active: searchForm.features.includes(feature.value) }"
              @click="toggleFeature(feature.value)"
              :effect="searchForm.features.includes(feature.value) ? 'dark' : 'plain'"
            >
              {{ feature.label }}
            </el-tag>
          </div>
        </div>

        <!-- 批次 -->
        <div class="filter-group">
          <div class="filter-label">批次</div>
          <div class="filter-content">
            <el-tag
              v-for="batch in batches"
              :key="batch.value"
              :class="{ active: searchForm.batch === batch.value }"
              @click="searchForm.batch = batch.value"
              :effect="searchForm.batch === batch.value ? 'dark' : 'plain'"
            >
              {{ batch.label }}
            </el-tag>
          </div>
        </div>

        <!-- 科别 -->
        <div class="filter-group">
          <div class="filter-label">科别</div>
          <div class="filter-content">
            <el-tag
              v-for="type in types"
              :key="type.value"
              :class="{ active: searchForm.type === type.value }"
              @click="searchForm.type = type.value"
              :effect="searchForm.type === type.value ? 'dark' : 'plain'"
            >
              {{ type.label }}
            </el-tag>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 学校列表 -->
    <div class="school-list">
      <school-card
        v-for="school in filteredSchools"
        :key="school.code"
        :school="school"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'
import SchoolCard from './components/SchoolCard.vue'
import { mockSchools } from './mock'
import type { School } from '@/types/school'
import areaOptions from '@/config/area-option.json'

// 搜索表单
const searchForm = ref({
  keyword: '',
  region: '',
  features: [] as string[],
  batch: '',
  type: ''
})

// 从 area-option.json 获取省份列表
const regions = computed(() => {
  return areaOptions.body.map(area => area.name)
})

// 其他筛选选项
const features = [
  { label: '985', value: '985' },
  { label: '211', value: '211' },
  { label: '双一流', value: 'double_first' }
]
const batches = [
  { label: '本科', value: 'undergraduate' },
  { label: '专科', value: 'college' }
]
const types = [
  { label: '理科', value: 'science' },
  { label: '文科', value: 'liberal_arts' }
]

// 切换院校特色
const toggleFeature = (feature: string) => {
  const index = searchForm.value.features.indexOf(feature)
  if (index > -1) {
    searchForm.value.features.splice(index, 1)
  } else {
    searchForm.value.features.push(feature)
  }
}

// 学校搜索建议
const querySchools = (keyword: string, cb: (arg: any[]) => void) => {
  const results = mockSchools
    .filter(school => school.name.includes(keyword))
    .map(school => ({
      value: school.name,
      link: school.code
    }))
  cb(results)
}

// 选择学校
const handleSelect = (item: any) => {
  console.log('选择学校:', item)
}

// 过滤后的学校列表
const filteredSchools = computed(() => {
  return mockSchools.filter(school => {
    // 关键字匹配
    if (searchForm.value.keyword && !school.name.includes(searchForm.value.keyword)) {
      return false
    }
    // 地区匹配
    if (searchForm.value.region && school.region !== searchForm.value.region) {
      return false
    }
    // 特色匹配
    if (searchForm.value.features.length > 0) {
      const hasFeature = searchForm.value.features.every(feature => 
        school.features.includes(feature)
      )
      if (!hasFeature) return false
    }
    // 批次匹配
    if (searchForm.value.batch && school.batch !== searchForm.value.batch) {
      return false
    }
    // 科别匹配
    if (searchForm.value.type && school.type !== searchForm.value.type) {
      return false
    }
    return true
  })
})
</script>

<style scoped>
.school-select-page {
  padding: 24px;
  background: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.filter-card {
  margin-bottom: 24px;
  border-radius: 8px;
}

.search-section {
  margin-bottom: 24px;
}

.search-input {
  width: 100%;
  max-width: 500px;
}

.filter-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 16px;
}

.filter-label {
  min-width: 80px;
  color: #606266;
  font-weight: bold;
}

.filter-content {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

:deep(.el-tag) {
  cursor: pointer;
  transition: all 0.3s ease;
  
  &.active {
    background: linear-gradient(45deg, #409EFF, #36D1DC);
    border: none;
    color: #fff;
    
    &:hover {
      opacity: 0.9;
    }
  }
  
  &:not(.active):hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
}

.school-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}
</style> 