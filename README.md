# DreamBridge Web

高考志愿推荐系统前端项目

## 开发环境

- Node.js >= 16
- pnpm >= 7

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

## 项目结构

```
src/
  ├── api/        # API 接口
  ├── assets/     # 静态资源
  ├── components/ # 公共组件
  ├── config/     # 配置文件
  │   ├── area-option.json  # 地区数据
  │   └── majorList.json    # 专业数据
  ├── router/     # 路由配置
  ├── stores/     # 状态管理
  ├── styles/     # 全局样式
  ├── types/      # 类型定义
  ├── utils/      # 工具函数
  └── views/      # 页面组件
```

## 技术栈

- Vue 3
- TypeScript
- Vite
- Element Plus
- Pinia

## 更新日志

### 2024-03-xx

#### 志愿推荐页面优化
- 新增院校地区多选功能
  - 支持省份多选
  - 添加"不限"选项
  - 优化选中状态显示
- 新增专业类别选择功能
  - 实现专业大类导航
  - 支持二级分类展示
  - 添加专业多选功能
- 统一筛选区域布局
  - 将筛选条件整合到同一行
  - 优化输入框和下拉框样式
  - 添加搜索功能
