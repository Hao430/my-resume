# 简历数据同步指南

## 📌 数据源说明

从现在开始，**`resume-data.json`** 是唯一的数据源文件。

## 🚀 使用方法

### 方式一：使用 npm 命令（推荐）
```bash
npm run sync-resume
```

### 方式二：使用批处理脚本（Windows）
双击运行 `scripts/sync-resume.bat`

### 方式三：直接运行
```bash
node scripts/sync-resume.js
```

## 📝 编辑流程

1. 打开 `resume-data.json` 文件
2. 修改你需要更新的内容
3. 运行同步命令：`npm run sync-resume`
4. 刷新网页查看更新

## 📂 文件说明

| 文件 | 作用 |
|------|------|
| `resume-data.json` | **主数据源** - 在这里编辑所有简历数据 |
| `src/data/resume.ts` | 网页数据文件 - 由脚本自动生成，**不要手动编辑** |
| `scripts/sync-resume.js` | 同步脚本 - 将 JSON 转换为 TypeScript |
| `scripts/sync-resume.bat` | Windows 快捷启动脚本 |

## 💡 提示

- ✅ 只需编辑 `resume-data.json`
- ✅ 运行同步命令后网页会自动更新
- ❌ 不要手动编辑 `src/data/resume.ts`（会被覆盖）
- 🔄 每次修改 JSON 后都要运行同步命令

## 📊 数据结构

`resume-data.json` 包含以下模块：
- `personalInfo` - 个人信息
- `professionalSummary` - 个人简介
- `skills` - 专业技能
- `projectExperiences` - 项目经验
- `workExperiences` - 工作经历
- `honors` - 荣誉证书

所有字段都有详细注释，易于理解和编辑。