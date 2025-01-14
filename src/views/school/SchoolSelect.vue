<template>
  <div class="school-select">
    <!-- 搜索框和查询按钮 -->
    <div class="search-container">
      <el-input
        v-model="filterForm.name"
        placeholder="请输入学校名称"
        class="search-input"
        clearable
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-button type="primary" class="search-btn" @click="handleSearch">
        查询
      </el-button>
    </div>

    <!-- 筛选条件区域 -->
    <div class="filter-section">
      <!-- 第一行：院校地区 -->
      <div class="filter-row">
        <div class="filter-group">
          <div class="filter-label">院校地区</div>
          <div class="filter-content">
            <el-tag
              v-for="area in areaList"
              :key="area.id"
              :effect="filterForm.areas.includes(area.id) ? 'dark' : 'plain'"
              class="filter-tag"
              @click="toggleFilter('areas', area.id)"
            >
              {{ area.name }}
            </el-tag>
          </div>
        </div>
      </div>

      <!-- 第二行：批次、科别和院校特色 -->
      <div class="filter-row">
        <div class="filter-group">
          <div class="filter-label">批次</div>
          <div class="filter-content">
            <el-tag
              v-for="batch in ['本科', '专科']"
              :key="batch"
              :effect="filterForm.batch === batch ? 'dark' : 'plain'"
              class="filter-tag"
              @click="setFilter('batch', batch)"
            >
              {{ batch }}
            </el-tag>
          </div>
        </div>

        <div class="filter-group">
          <div class="filter-label">科别</div>
          <div class="filter-content">
            <el-tag
              v-for="subject in ['理科', '文科']"
              :key="subject"
              :effect="filterForm.subjectType === subject ? 'dark' : 'plain'"
              class="filter-tag"
              @click="setFilter('subjectType', subject)"
            >
              {{ subject }}
            </el-tag>
          </div>
        </div>

        <div class="filter-group">
          <div class="filter-label">院校特色</div>
          <div class="filter-content">
            <el-tag
              v-for="type in ['985', '211']"
              :key="type"
              :effect="filterForm.schoolTypes.includes(type) ? 'dark' : 'plain'"
              class="filter-tag"
              @click="toggleFilter('schoolTypes', type)"
            >
              {{ type }}
            </el-tag>
          </div>
        </div>
      </div>
    </div>

    <!-- 学校卡片列表 -->
    <SchoolCard :schools="displaySchools" />

    <!-- 分页器 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="totalSchools"
        :page-sizes="[12, 24, 36, 48]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'
import SchoolCard from '@/components/SchoolCard.vue'
import areaOptionsRaw from '@/config/area-option.json'
import schoolMajorCode from '@/config/schoolMajorCode.json'
import { getSchoolCards } from '@/api/school'
import { ElMessage } from 'element-plus'

// 地区列表
const areaList = areaOptionsRaw.body

// 筛选条件
const filterForm = ref({
  name: '',
  areas: [],
  schoolTypes: [],
  batch: '',
  subjectType: ''
})

// 分页相关
const currentPage = ref(1)
const pageSize = ref(12)
const schools = ref([])

// 根据筛选条件过滤学校
const filteredSchools = computed(() => {
  let result = schools.value

  // 按名称筛选
  if (filterForm.value.name) {
    result = result.filter(school => 
      school.name.toLowerCase().includes(filterForm.value.name.toLowerCase())
    )
  }

  // 按地区筛选
  if (filterForm.value.areas.length > 0) {
    result = result.filter(school => 
      filterForm.value.areas.includes(school.region)
    )
  }

  // 按院校特色筛选
  if (filterForm.value.schoolTypes.length > 0) {
    result = result.filter(school => 
      (filterForm.value.schoolTypes.includes('985') && school.is_985) ||
      (filterForm.value.schoolTypes.includes('211') && school.is_211)
    )
  }

  // 按批次筛选
  if (filterForm.value.batch) {
    result = result.filter(school => 
      school.batch.includes(filterForm.value.batch)
    )
  }

  // 按科别筛选
  if (filterForm.value.subjectType) {
    result = result.filter(school => 
      school.subject_type === filterForm.value.subjectType
    )
  }

  return result
})

// 计算总学校数
const totalSchools = computed(() => {
  return filteredSchools.value.length
})

// 当前页显示的学校
const displaySchools = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredSchools.value.slice(start, end)
})

// 切换多选筛选条件
const toggleFilter = (field: string, value: string) => {
  const arr = filterForm.value[field] as string[]
  const index = arr.indexOf(value)
  if (index > -1) {
    arr.splice(index, 1)
  } else {
    arr.push(value)
  }
}

// 设置单选筛选条件
const setFilter = (field: string, value: string) => {
  filterForm.value[field] = filterForm.value[field] === value ? '' : value
}

// 加载学校数据
const loadSchools = async () => {
  try {
    // 检查用户是否已登录
    const token = localStorage.getItem('token')
    if (!token) {
      ElMessage.error('请先登录')
      return
    }

    // 从配置文件获取学校ID列表
    const schoolIds = schoolMajorCode.data.school.map(school => parseInt(school.school_id))
    console.log('School IDs to fetch:', schoolIds)
    
    const response = await getSchoolCards(schoolIds)
    console.log('Raw API Response:', response)
    
    // 检查响应数据结构
    if (!response) {
      throw new Error('响应数据为空')
    }

    const rawSchools = Array.isArray(response) ? response : response.data

    if (!Array.isArray(rawSchools)) {
      throw new Error('无效的响应格式')
    }

    // 处理学校数据，按学校代码分组并收集分数
    const schoolMap = new Map()
    
    // 第一次遍历，创建基本学校信息
    rawSchools.forEach(school => {
      if (!schoolMap.has(school.school_code)) {
        // 如果是新学校，创建基本信息，但不包含分数
        const { year, lowest_score, lowest_rank, ...schoolInfo } = school
        schoolMap.set(school.school_code, {
          ...schoolInfo,
          scores: []
        })
      }
    })

    // 第二次遍历，添加所有分数记录
    rawSchools.forEach(school => {
      const schoolData = schoolMap.get(school.school_code)
      schoolData.scores.push({
        year: school.year,
        lowest_score: school.lowest_score,
        lowest_rank: school.lowest_rank
      })
    })

    // 对每个学校的分数按年份降序排序
    schoolMap.forEach(school => {
      school.scores.sort((a, b) => b.year - a.year)
    })

    schools.value = Array.from(schoolMap.values())
    console.log('Processed Schools:', schools.value)

  } catch (error: any) {
    schools.value = []
    console.error('Failed to load schools:', error)
    if (error.response) {
      console.error('Error response:', error.response)
      ElMessage.error(`加载学校数据失败: ${error.response.data?.message || '服务器错误'}`)
    } else {
      ElMessage.error(`加载学校数据失败: ${error.message || '未知错误'}`)
    }
  }
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1 // 重置页码
}

// 处理页码变化
const handleCurrentChange = (val: number) => {
  currentPage.value = val
}

// 处理每页显示数量变化
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1 // 重置页码
}

onMounted(() => {
  loadSchools()
})
</script>

<style scoped>
.school-select {
  padding: 24px;
  background: #fff;
  min-height: calc(100vh - 60px);
}

.search-container {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  max-width: 500px;
}

.search-btn {
  padding: 0 24px;
  font-weight: bold;
}

.filter-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
}

.filter-row {
  display: flex;
  gap: 40px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-label {
  font-size: 14px;
  color: #666;
  font-weight: bold;
  white-space: nowrap;
}

.filter-content {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

:deep(.el-tag) {
  margin: 0;
  padding: 0 12px;
  height: 28px;
  line-height: 28px;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  font-size: 12px;
  border: 1px solid #409EFF;
  background-color: #fff;
  color: #409EFF;
  transition: all 0.3s;
}

:deep(.el-tag.el-tag--plain) {
  background-color: #fff;
  border-color: #409EFF;
  color: #409EFF;
}

:deep(.el-tag.el-tag--dark) {
  background-color: #409EFF;
  border-color: #409EFF;
  color: #fff;
}

:deep(.el-tag:hover) {
  opacity: 0.85;
}

/* 搜索框样式 */
:deep(.el-input__wrapper) {
  border-radius: 20px;
  padding: 0 15px;
}

:deep(.el-input__inner) {
  height: 40px;
}
</style> 