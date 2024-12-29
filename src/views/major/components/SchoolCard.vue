<template>
    <el-card class="school-card" :body-style="{ padding: '0' }">
        <div class="school-header">
            <div class="school-logo">
                <span class="match-rate">{{ getMatchRate() }}%</span>
            </div>
            <div class="school-info">
                <h3>{{ school.name }}</h3>
                <div class="school-tags">
                    <el-tag v-for="tag in school.tags" :key="tag" size="small">{{ tag }}</el-tag>
                </div>
            </div>
            <div class="school-actions">
                <el-button type="primary" size="small">查看详情</el-button>
            </div>
        </div>
        
        <div class="school-body">
            <div class="school-features">
                <span v-for="feature in school.features" :key="feature">{{ feature }}</span>
            </div>
            
            <div class="score-history">
                <div class="year-score" v-for="(data, year) in school.scores" :key="year">
                    <div class="year">{{ year }}年</div>
                    <div class="score-info">
                        <div>分数：{{ data.score }}</div>
                        <div>位次：{{ data.rank }}</div>
                        <div>计划：{{ data.plan }}人</div>
                    </div>
                </div>
            </div>
        </div>
    </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    school: {
        name: string
        tags: string[]
        features: string[]
        scores: Record<string, { score: number; rank: number; plan: number }>
    }
    userScore: number
}>()

const getMatchRate = () => {
    // 模拟匹配度计算
    return Math.floor(Math.random() * 20 + 80)
}
</script>

<style scoped>
.school-card {
    border-radius: 8px;
    overflow: hidden;
}

.school-header {
    padding: 15px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eee;
}

.school-logo {
    width: 60px;
    height: 60px;
    background: #f56c6c;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
}

.match-rate {
    color: white;
    font-size: 16px;
    font-weight: bold;
}

.school-info {
    flex: 1;
    
    h3 {
        margin: 0 0 8px 0;
    }
}

.school-tags {
    display: flex;
    gap: 5px;
}

.school-body {
    padding: 15px;
}

.school-features {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
    
    span {
        font-size: 12px;
        color: #666;
    }
}

.score-history {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
}

.year-score {
    text-align: center;
    
    .year {
        font-weight: bold;
        margin-bottom: 5px;
    }
    
    .score-info {
        font-size: 12px;
        color: #666;
        
        > div {
            margin: 3px 0;
        }
    }
}
</style> 