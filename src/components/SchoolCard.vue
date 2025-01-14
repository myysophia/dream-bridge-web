<template>
  <div class="school-cards">
    <div v-for="school in schools" :key="school.school_code" class="school-card">
      <div class="card-header">
        <img :src="`https://static-file.daxue.cn/images/${school.name}.png`" :alt="school.name" class="school-logo">
        <div class="school-title">
          <h3>{{ school.name }} <span class="school-code">({{ school.school_code }})</span></h3>
          <div class="school-tags">
            <span v-if="school.is_985" class="tag tag-985">985</span>
            <span v-if="school.is_211" class="tag tag-211">211</span>
          </div>
          <div class="school-points">
            <span class="point-item">
              <el-icon><Histogram /></el-icon>
              博士点{{ school.phd_point }}
            </span>
            <span class="divider">|</span>
            <span class="point-item">
              <el-icon><Trophy /></el-icon>
              硕士点{{ school.master_point }}
            </span>
          </div>
        </div>
      </div>

      <div class="card-body">
        <div class="score-history">
          <div class="score-title">历年分数线</div>
          <div class="score-content">
            <div v-for="year in [2023, 2022, 2021, 2020]" :key="year" class="score-item">
              <div class="year">{{ year }}</div>
              <div class="score">{{ getScoreByYear(school, year) }}</div>
            </div>
          </div>
        </div>

        <div class="card-footer">
          <div class="contact-info">
            <div v-if="school.website" class="info-item">
              <el-icon><Link /></el-icon>
              <a :href="school.website" target="_blank" class="link-text">官网链接</a>
            </div>
            <div v-if="school.recruitment_phone" class="info-item">
              <el-icon><Phone /></el-icon>
              <span class="phone-text">{{ school.recruitment_phone }}</span>
            </div>
          </div>

          <div class="disciplines">
            <div class="discipline-title">一级学科</div>
            <div class="discipline-list">
              {{ school.first_class_disciplines?.filter(d => d).join(', ') || '暂无数据' }}
            </div>
          </div>

          <div class="view-more">
            <el-link type="primary">查看历年分数线 ></el-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Link, Phone, Histogram, Trophy } from '@element-plus/icons-vue'

interface SchoolScore {
  year: number
  lowest_score: number
  lowest_rank: number
}

interface School {
  name: string
  school_code: string
  is_985: boolean
  is_211: boolean
  phd_point: number
  master_point: number
  website: string
  recruitment_phone: string
  first_class_disciplines: string[]
  scores: SchoolScore[]
}

const props = defineProps<{
  schools: School[]
}>()

const getScoreByYear = (school: School, year: number) => {
  const score = school.scores?.find(s => s.year === year)
  if (!score || !score.lowest_score) return '-'
  return `${score.lowest_score}分`
}
</script>

<style scoped>
.school-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  padding: 20px 0;
}

.school-card {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
  background: #fff;
  transition: all 0.3s;
}

.school-card:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.school-logo {
  width: 80px;
  height: 80px;
  object-fit: contain;
}

.school-title {
  flex: 1;
}

.school-title h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.school-code {
  color: #909399;
  font-size: 14px;
  font-weight: normal;
}

.school-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.tag {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  color: #fff;
}

.tag-985 {
  background-color: #409EFF;
}

.tag-211 {
  background-color: #67C23A;
}

.school-points {
  font-size: 14px;
  color: #606266;
  display: flex;
  align-items: center;
  gap: 12px;
}

.point-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.point-item .el-icon {
  font-size: 16px;
  color: #409EFF;
}

.divider {
  color: #dcdfe6;
}

.score-history {
  margin-bottom: 20px;
}

.score-title {
  font-size: 14px;
  color: #606266;
  margin-bottom: 12px;
}

.score-content {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.score-item {
  text-align: center;
  padding: 8px;
  background: #f5f7fa;
  border-radius: 4px;
  transition: all 0.3s;
}

.score-item:hover {
  background: #ecf5ff;
}

.year {
  font-size: 13px;
  color: #606266;
  margin-bottom: 4px;
  font-weight: bold;
}

.score {
  font-size: 14px;
  color: #409EFF;
  font-weight: 500;
  white-space: nowrap;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #606266;
  font-size: 14px;
}

.info-item .el-icon {
  color: #409EFF;
}

.link-text {
  color: #409EFF;
  text-decoration: none;
}

.link-text:hover {
  text-decoration: underline;
}

.phone-text {
  color: #606266;
}

.card-footer {
  border-top: 1px solid #e4e7ed;
  padding-top: 16px;
}

.disciplines {
  margin-bottom: 12px;
}

.discipline-title {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
}

.discipline-list {
  font-size: 14px;
  color: #909399;
  line-height: 1.4;
}

.view-more {
  text-align: right;
}
</style> 