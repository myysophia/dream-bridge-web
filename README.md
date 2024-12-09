# DreamBridge Web - 高考志愿智能推荐系统前端

## 技术栈
- Vue 3 
- TypeScript
- Vite
- Element Plus
- Pinia
- Vue Router
- Axios

```
{
  "dependencies": {
    "vue": "^3.3.0",
    "vue-router": "^4.2.0",
    "pinia": "^2.1.0",
    "axios": "^1.6.0",
    "element-plus": "^2.4.0",
    "typescript": "^5.0.0",
    "vite": "^4.5.0"
  }
}
```

## 功能模块

### 1. 用户认证模块
- [x] 登录
- [x] 注册
- [x] 邮箱验证
- [ ] 密码重置

实现过程:
1. 创建 auth 相关组件和路由
2. 使用 Element Plus 的 Form 组件实现表单
3. 集成邮箱验证码功能
4. 使用 Pinia 管理登录状态
5. 实现路由守卫

### 2. 用户信息管理
- [ ] 基本信息设置
- [ ] 选科信息
- [ ] 分数信息
- [ ] 兴趣测评

实现计划:
1. 设计用户信息表单
2. 实现选科联动逻辑
3. 添加表单验证
4. 集成兴趣测评组件

### 3. 志愿推荐系统
- [ ] 院校推荐
- [ ] 专业匹配
- [ ] 历史数据分析
- [ ] 结果导出

实现计划:
1. 设计推荐结果展示界面
2. 实现分数线比对功能
3. 添加院校筛选功能
4. 集成数据可视化组件

## 项目结构
```
dream-bridge-web/
├── src/
│   ├── api/                 # API 请求
│   │   ├── auth.ts         # 认证相关
│   │   ├── user.ts         # 用户相关
│   │   └── major.ts        # 专业相关
│   ├── components/         # 通用组件
│   ├── views/              # 页面
│   │   ├── auth/          # 认证相关页面
│   │   ├── user/          # 用户相关页面
│   │   └── major/         # 专业推荐相关页面
│   ├── store/             # 状态管理
│   ├── router/            # 路由配置
│   ├── utils/             # 工具函数
│   └── types/             # TypeScript 类型定义
├── public/                # 静态资源
└── package.json
```

## 开发进度

### 第一阶段: 基础框架搭建
- [x] 项目初始化
- [x] 路由配置
- [x] 状态管理
- [ ] API 封装
- [ ] 组件库集成

### 第二阶段: 用户系统开发
- [ ] 登录注册
- [ ] 个人信息
- [ ] 选科管理
- [ ] 兴趣测评

### 第三阶段: 推荐系统开发
- [ ] 院校查询
- [ ] 专业匹配
- [ ] 志愿推荐
- [ ] 数据分析

## 本地开发

```
# 使用 Vite 创建项目
npm create vite@latest dream-bridge-web -- --template vue-ts

# 进入项目目录
cd dream-bridge-web

# 安装依赖
npm install vue-router@4 pinia axios element-plus

# 安装开发依赖
npm install -D typescript @types/node
```

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 注意事项
1. 使用 TypeScript 编写代码
2. 遵循 Vue 3 组合式 API 风格
3. 保持组件粒度适中
4. 注重代码复用性
