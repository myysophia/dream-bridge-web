// 缓存工具
export const scoreCache = {
    // 最大缓存数量
    maxItems: 20,

    set(key: string, data: any, expire = 3600000) { // 默认1小时过期
        try {
            // 检查缓存数量
            const keys = Object.keys(localStorage)
            const scoreKeys = keys.filter(k => k.startsWith('score_'))

            // 如果超出最大数量，删除最早的缓存
            if (scoreKeys.length >= this.maxItems) {
                // 获取并排序所有缓存项
                const cacheItems = scoreKeys.map(k => {
                    const item = localStorage.getItem(k)
                    return {
                        key: k,
                        expire: item ? JSON.parse(item).expire : 0
                    }
                }).sort((a, b) => a.expire - b.expire)

                // 删除最早的缓存
                localStorage.removeItem(cacheItems[0].key)
            }

            const item = {
                data,
                expire: Date.now() + expire
            }
            localStorage.setItem(key, JSON.stringify(item))
        } catch (error) {
            // 如果存储失败，清空所有分数相关缓存
            this.clearScoreCache()
            // 重试一次
            const item = {
                data,
                expire: Date.now() + expire
            }
            localStorage.setItem(key, JSON.stringify(item))
        }
    },

    get(key: string) {
        try {
            const item = localStorage.getItem(key)
            if (!item) return null

            const { data, expire } = JSON.parse(item)
            if (Date.now() > expire) {
                localStorage.removeItem(key)
                return null
            }
            return data
        } catch (error) {
            return null
        }
    },

    // 清理所有分数相关缓存
    clearScoreCache() {
        const keys = Object.keys(localStorage)
        keys.forEach(key => {
            if (key.startsWith('score_')) {
                localStorage.removeItem(key)
            }
        })
    }
} 