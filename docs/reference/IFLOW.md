# 张豪个人简历网站 - 项目文档

## 项目概述
这是一个使用 Vue.js 3、TypeScript 和 Vite 构建的静态个人简历网站。网站采用简约现代的设计风格，全面展示张豪的个人信息、技能专长、项目经验、工作经历及荣誉证书，为访问者提供清晰直观的个人品牌展示。

## 核心特性
- **技术栈**：Vue.js 3 + Vite + TypeScript + Vue Router + Pinia
- **设计风格**：简约现代，注重用户体验与信息可读性
- **响应式设计**：适配桌面、平板、手机等多种设备
- **性能优化**：静态网站形式，加载速度快，首屏加载时间<3秒
- **组件化架构**：采用模块化组件设计，便于维护与扩展
- **类型安全**：全面使用 TypeScript 类型系统，提高代码可靠性
- **开发工具**：集成 Vue DevTools 开发者调试工具
- **路由管理**：集成 Vue Router，支持页面导航和路由功能扩展

## 🚀 快速开始

### 项目启动
1.  确保已安装 Node.js 环境（要求：^20.19.0 || >=22.12.0）
2.  在项目根目录执行以下命令：
    ```powershell
    npm install
    ```
3.  启动开发服务器：
    ```powershell
    npm run dev
    ```
4.  在浏览器访问 `http://localhost:5173` 预览网站

### 构建与部署
- 类型检查并生成生产版本：
  ```powershell
  npm run build
  ```
- 预览生产版本：
  ```powershell
  npm run preview
  ```
- 代码检查（自动修复）：
  ```powershell
  npm run lint
  ```

## 📁 项目结构
项目包含以下核心文件和目录：

| 文件/目录 | 作用 |
| :--- | :--- |
| **`src/App.vue`** | 应用主组件，组织页面整体布局 |
| **`src/main.ts`** | 应用入口文件，初始化 Vue 应用和 Router |
| **`src/router/index.ts`** | Vue Router 路由配置（当前为单页应用，路由待扩展） |
| **`src/stores/`** | Pinia 状态管理目录 |
| **`src/components/`** | 页面组件目录（Header, Footer, PersonalInfo, Skills 等） |
| **`src/data/resume.ts`** | 简历数据源文件，包含个人信息、经历等 |
| **`src/types/resume.ts`** | TypeScript 类型定义文件 |
| **`src/assets/styles/`** | 全局样式文件（variables.css, global.css） |
| **`index.html`** | 主 HTML 模板 |
| **`vite.config.ts`** | Vite 构建工具配置文件 |
| **`package.json`** | 项目依赖和脚本配置 |
| **`goal.md`** | 项目开发目标文档 |
| **`README.md`** | 项目说明文档 |

## 💡 已实现功能模块
- **个人信息展示**：姓名、民族、籍贯、专业、学院等基本信息
  - 对应组件：`src/components/PersonalInfo.vue`
- **个人简介**：职业概述、专业优势、综合能力和素养特长
  - 对应组件：`src/components/ProfessionalSummary.vue`
- **联系方式**：邮箱、GitHub 链接
  - 对应组件：`src/components/PersonalInfo.vue`
- **专业技能**：以分类标签形式展示的技能清单（专业技能、技术技能、工具技能）
  - 对应组件：`src/components/Skills.vue`
- **项目经验**：
  - 数字监理系统（2025.12 – 至今，全栈开发）
  - Bilibili 视频文稿助手（2024.06 – 至今，独立开发者）
  - 南风AI智能聊天应用（2024.01 – 至今，独立开发者）
  - 党员管理系统（2025.10 – 2025.12，项目负责人）
  - 康韵食尚健康餐饮平台（2025.03 – 2025.10，产品负责人）
  - 对应组件：`src/components/ProjectExperience.vue`
- **工作经历**：
  - 贵州建工监理咨询有限公司（2025.11 – 至今，产品支持实习生）
  - 学生党支部（2025.05 – 至今，副书记）
  - 大数据科创协会（2024.05 – 至今，会长）
  - 对应组件：`src/components/WorkExperience.vue`
- **荣誉证书**：电子商务"三创赛"省一等奖、"互联网+"省金奖、数学建模省二等奖、挑战杯省三等奖、励志奖学金
  - 对应组件：`src/components/Honors.vue`
- **页面布局**：Header 页头和 Footer 页脚
  - 对应组件：`src/components/Header.vue`, `src/components/Footer.vue`

## 开发命令
- `npm run dev`：启动开发服务器（带热更新）
- `npm run build`：运行类型检查并构建生产版本
- `npm run build-only`：仅构建，不进行类型检查
- `npm run type-check`：运行 TypeScript 类型检查（vue-tsc）
- `npm run preview`：预览生产版本
- `npm run lint`：运行完整的代码检查（oxlint + eslint，自动修复）
- `npm run lint:oxlint`：仅运行 oxlint 检查
- `npm run lint:eslint`：仅运行 eslint 检查

## 📝 开发环境要求
- **Node.js**：^20.19.0 或 >=22.12.0
- **包管理器**：npm
- **推荐 IDE**：VS Code + Vue (Official) 插件
- **推荐浏览器**：Chrome/Edge（支持 Vue DevTools）或 Firefox

## 🎨 技术细节

### 核心依赖
- **vue**: ^3.5.27 - 渐进式 JavaScript 框架
- **vue-router**: ^5.0.1 - 官方路由管理器
- **pinia**: ^3.0.4 - Vue 官方状态管理库

### 开发工具
- **vite**: ^7.3.1 - 下一代前端构建工具
- **typescript**: ~5.9.3 - JavaScript 超集
- **vue-tsc**: ^3.2.4 - Vue 组件类型检查工具
- **oxlint**: ~1.42.0 - 高性能 JavaScript/TypeScript linter
- **eslint**: ^9.39.2 - 代码质量检查工具
- **eslint-plugin-vue**: ~10.7.0 - Vue 专用 ESLint 插件
- **eslint-plugin-oxlint**: ~1.42.0 - Oxlint ESLint 插件
- **vite-plugin-vue-devtools**: ^8.0.5 - Vue 开发者工具
- **@vitejs/plugin-vue**: ^6.0.3 - Vite Vue 插件
- **@vitejs/plugin-vue-jsx**: ^5.1.3 - Vite Vue JSX 插件
- **npm-run-all2**: ^8.0.4 - 并行运行 npm 脚本工具

### 代码规范
- 使用 Composition API (`<script setup>`)
- 组件使用 TypeScript 类型定义
- 遵循 Vue 3 官方风格指南
- ESLint + Oxlint 双重代码检查
- 路径别名：`@` 指向 `src` 目录

### 路由配置
- 当前使用 Vue Router 5.x
- 路由模式：createWebHistory（基于 HTML5 History API）
- 路由配置文件：`src/router/index.ts`
- 当前状态：单页应用，路由数组为空，可扩展多页面功能

### 构建配置
- Vite 7.x 配置
- 启用 Vue DevTools 插件（开发环境）
- 支持 JSX 语法
- 路径别名配置：`@` → `src/`

---
**项目当前状态：** 核心功能已全部实现，包括个人信息、个人简介、技能展示（19项技能）、项目经验（5个项目）、工作经历（3段经历）和荣誉证书（5项荣誉）等模块。项目已完成组件化开发，数据与视图分离，采用 TypeScript 类型系统确保代码质量。网站已具备完整的响应式设计能力，可在不同设备上正常展示。路由框架已搭建完成，可扩展为多页面应用。
