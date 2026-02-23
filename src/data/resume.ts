import type { ResumeData } from '../types/resume'

export const resumeData: ResumeData = {
  personalInfo: {
    name: '张豪',
    ethnicity: '汉族',
    nativePlace: '湖南湘潭',
    contact: {
      email: 'fervent430@163.com',
      github: 'github.com/hao430'
    },
    university: '贵阳学院',
    college: '计算机科学学院',
    major: '数据科学与大数据技术'
  },
  skills: [
    { name: '用户调研', category: 'professional' },
    { name: '需求分析', category: 'professional' },
    { name: '数据可视化', category: 'technical' },
    { name: 'SQL查询', category: 'technical' },
    { name: '产品文档撰写', category: 'professional' },
    { name: '项目管理', category: 'professional' },
    { name: 'Next.js', category: 'technical' },
    { name: 'TypeScript', category: 'technical' },
    { name: 'Vue.js', category: 'technical' },
    { name: 'JavaScript', category: 'technical' },
    { name: '浏览器扩展开发', category: 'technical' },
    { name: 'Python', category: 'technical' },
    { name: 'Git协作', category: 'tools' },
    { name: 'Excel', category: 'tools' },
    { name: 'FineBI', category: 'tools' },
    { name: 'AI协作工具', category: 'tools' },
    { name: '云平台管理', category: 'technical' }
  ],
  workExperiences: [
    {
      period: '2025.11 – 至今',
      company: '贵州建工监理咨询有限公司',
      position: '产品支持实习生',
      achievements: [
        '需求调研：走访多个工地现场，与一线管理人员沟通，系统梳理项目管理的核心流程与数据需求，形成清晰的需求文档。',
        '功能实现：负责项目全景图模块的产品方案与数据逻辑设计，协同开发团队完成功能落地，实现工程进度的可视化透明管理。',
        '数据治理：参与制定数据校验规则，推动历史数据清洗与录入规范，有效提升业务数据的可用性与决策参考价值。'
      ]
    },
    {
      period: '2025.05 – 至今',
      company: '学生党支部',
      position: '副书记',
      achievements: [
        '生活统筹：定期策划并主持"三会一课"及主题党日活动，确保组织生活有序开展，强化党员的理论学习与凝聚力。',
        '计划设计：主导制定"红芯成长计划"与党员实践方案，建立从培养到考核的闭环管理机制，提升党员发展的系统性与规范性。',
        '流程优化：推动党员发展全流程电子化跟踪，实现从申请到转正各环节的线上记录与动态管理，提升党务工作效率。'
      ]
    },
    {
      period: '2024.05 – 至今',
      company: '大数据科创协会',
      position: '会长',
      achievements: [
        '团队搭建：组建算法集训队与项目小组，吸引50余名成员加入，并制定实验室管理、例会等制度，营造务实协作的技术氛围。',
        '项目孵化：通过定期技术分享与项目评审，引导多个实战项目落地，协助团队明确方向并协调资源，加速想法向成果转化。',
        '资源联动：积极对接学院与企业，组织技术竞赛与行业讲座，拓展成员视野，提升协会在校园科技社群中的活跃度与影响力。'
      ]
    }
  ],
  projectExperiences: [
    {
      period: '2024.06 – 至今',
      projectName: 'Bilibili 视频文稿助手',
      role: '独立开发者',
      descriptions: [
        '产品定位：开发一款专为 Bilibili 视频平台设计的浏览器扩展，提供智能字幕处理和 AI 内容生成服务，帮助用户快速获取、整理和理解视频内容，提升学习和工作效率。',
        '核心功能：实现极速字幕获取（通过 B 站 API）、无字幕视频支持（集成 Whisper API 语音识别）、AI 内容生成（逐字稿、视频纪要、观点提取）；支持时间戳跳转、一键复制、多模型配置等功能。',
        '技术实现：采用 Manifest V3 架构，使用原生 JavaScript 开发，无需框架依赖；支持 OpenAI GPT-3.5/4、Claude-3、DeepSeek、豆包、通义千问等多种 AI 模型；通过 Chrome Storage API 实现数据持久化和智能缓存。'
      ]
    },
    {
      period: '2024.01 – 至今',
      projectName: '南风AI智能聊天应用',
      role: '独立开发者',
      descriptions: [
        '架构设计：基于 Next.js 14 和 TypeScript 构建现代化 AI 聊天应用，利用 EdgeOne Pages 边缘函数技术实现免费部署，集成 DeepSeek R1 系列大语言模型，提供实时网络搜索功能。',
        '功能实现：开发完整的聊天界面和消息管理系统，支持流式响应、思考过程可视化、代码高亮、Mermaid 图表渲染等高级特性；实现与 OpenAI 兼容的 API 接口，支持多模型动态切换（R1 Distill、R1、V3）。',
        '技术亮点：集成 SearXNG 无追踪搜索引擎，实现搜索增强对话功能；采用响应式设计，适配桌面、平板、手机等多种设备；通过边缘节点部署实现全球低延迟访问，支持日均数千次请求。'
      ]
    },
    {
      period: '2025.10 – 2025.12',
      projectName: '党员管理系统',
      role: '项目负责人',
      descriptions: [
        '架构设计：针对传统党员信息管理效率低、数据零散的痛点，牵头设计涵盖党员基本信息、组织关系、考核评议、党费缴纳等核心字段的数据库结构，支持多维度组合查询与数据统计，满足党务工作日常管理需求。',
        '效率优化：主导开发可视化数据仪表盘，集成党员结构分析、组织生活参与率、党费收缴进度等关键指标，支持自动生成季度/年度党务工作报告，将党务人员从繁琐的人工统计工作中解放，统计效率提升60%。',
        '流程数字化：搭建入党申请至转正全流程线上跟踪体系，建立标准化工作流，提升信息管理准确性与时效性。'
      ]
    },
    {
      period: '2025.03 – 2025.10',
      projectName: '康韵食尚健康餐饮平台',
      role: '产品负责人',
      descriptions: [
        '需求调研：牵头开展全产业链需求调研，深度访谈餐饮商户、供应链服务商、终端用户等相关方近30人，结合200份用户线上调研问卷，精准挖掘用户对健康餐品、食材溯源、配送时效的核心需求，输出3万字需求分析报告，为产品功能设计提供决策。',
        '方案落地：基于调研结果设计"智能推荐+服务自动化"产品方案，搭建用户画像标签体系，实现健康餐品个性化推荐；开发商户订单管理自动化模块，优化接单、配单流程，降低商户人工操作成本。',
        '数据迭代：搭建用户行为数据看板，建立"需求-反馈"闭环，推动产品优化，提升用户复购率。'
      ]
    }
  ],
  honors: [
    { name: '电子商务"三创赛"省一等奖', level: '省级' },
    { name: '"互联网+"省金奖', level: '省级' },
    { name: '数学建模省二等奖', level: '省级' },
    { name: '挑战杯省三等奖', level: '省级' }
  ],
  professionalSummary: {
    strong: '专业扎实：有数据科学专业基础，主导过从0到1的产品项目，拥有"互联网+"省金奖等实践成果，理解业务与数据的结合逻辑。',
    comprehensive: '能力全面：擅长用户调研与需求分析，能通过数据工具进行问题定位与效果验证；具备产品规划、原型设计及跨团队协作经验，推动项目高效落地。',
    outstanding: '素养突出：责任心强、执行扎实，具备学生团队管理与多任务统筹经验，能适应快节奏协作，持续为产品注入用户价值与增长动力。'
  }
}