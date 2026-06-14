import type { ResumeData } from '../types/resume'

export const resumeData: ResumeData = {
  "personalInfo": {
    "name": "张豪",
    "ethnicity": "汉族",
    "nativePlace": "湖南湘潭",
    "contact": {
      "email": "fervent430@163.com",
      "github": "github.com/hao430"
    },
    "university": "贵阳学院",
    "college": "计算机科学学院",
    "major": "数据科学与大数据技术"
  },
  "professionalSummary": {
    "strong": "专业扎实：贵阳学院计算机科学学院数据科学与大数据技术专业在读（27届毕业生），具备扎实的计算机科学基础。主导过多个从0到1的产品项目和技术项目，拥有\"互联网+\"省金奖、数学建模省二等奖等实践成果，深入理解业务与数据结合的逻辑。",
    "comprehensive": "能力全面：擅长用户调研与需求分析，具备产品规划、原型设计及跨团队协作经验，能通过数据工具进行问题定位与效果验证。具备全栈开发能力，熟悉前后端技术栈，有AI应用开发、数据处理、系统架构设计经验。主导过企业级项目（360°全景云平台、DocLake数据湖系统），有完整的需求分析→架构设计→编码实现→部署上线经验。",
    "outstanding": "素养突出：责任心强、执行扎实，拥有团队管理与多任务统筹经验，能适应快节奏协作。熟练使用AI开发工具，掌握AI开发工作流（agent、skills、rules），坚持文档即代码理念，工程化思维，重视代码质量。"
  },
  "skills": [
    {
      "name": "Vue.js",
      "category": "technical"
    },
    {
      "name": "TypeScript",
      "category": "technical"
    },
    {
      "name": "JavaScript",
      "category": "technical"
    },
    {
      "name": "Next.js",
      "category": "technical"
    },
    {
      "name": "React",
      "category": "technical"
    },
    {
      "name": "HTML/CSS",
      "category": "technical"
    },
    {
      "name": "微信小程序开发",
      "category": "technical"
    },
    {
      "name": "Node.js",
      "category": "technical"
    },
    {
      "name": "Express",
      "category": "technical"
    },
    {
      "name": "Python",
      "category": "technical"
    },
    {
      "name": "FastAPI",
      "category": "technical"
    },
    {
      "name": "Java",
      "category": "technical"
    },
    {
      "name": "Spring Boot",
      "category": "technical"
    },
    {
      "name": "MySQL",
      "category": "technical"
    },
    {
      "name": "PostgreSQL",
      "category": "technical"
    },
    {
      "name": "Redis",
      "category": "technical"
    },
    {
      "name": "Docker",
      "category": "technical"
    },
    {
      "name": "Git",
      "category": "technical"
    },
    {
      "name": "Linux",
      "category": "technical"
    },
    {
      "name": "CI/CD",
      "category": "technical"
    },
    {
      "name": "云平台管理",
      "category": "technical"
    },
    {
      "name": "大模型应用开发",
      "category": "technical"
    },
    {
      "name": "NumPy/Pandas",
      "category": "technical"
    },
    {
      "name": "OCR/NLP",
      "category": "technical"
    },
    {
      "name": "用户调研",
      "category": "professional"
    },
    {
      "name": "需求分析",
      "category": "professional"
    },
    {
      "name": "产品设计",
      "category": "professional"
    },
    {
      "name": "数据分析",
      "category": "professional"
    },
    {
      "name": "项目管理",
      "category": "professional"
    },
    {
      "name": "VS Code",
      "category": "tools"
    },
    {
      "name": "Excel",
      "category": "tools"
    },
    {
      "name": "FineBI",
      "category": "tools"
    },
    {
      "name": "Navicat",
      "category": "tools"
    },
    {
      "name": "Postman",
      "category": "tools"
    },
    {
      "name": "AI协作工具",
      "category": "tools"
    },
    {
      "name": "飞书/钉钉",
      "category": "tools"
    }
  ],
  "projectExperiences": [
    {
      "period": "2025.12 – 至今",
      "projectName": "360°全景云平台 AI 智能文档处理后端系统",
      "role": "后端核心开发",
      "descriptions": [
        "为建筑工程行业打造的全景影像管理与AI智能文档处理一体化后端，采用Routes→Services→DAOs三层架构，经历五阶段重构（核心基础设施→模块化→稳定性→性能→可观测性），43个源码模块、约10,000行代码",
        "实现AI多引擎协同文档处理管线：多格式文档解析引擎（PDF电子/扫描版双模式、Office文档、图片文档），三阶段智能文档分类系统（L1关键字→L2 OCR→L3 AI语义），基于Redis List的异步任务队列，日均处理数十万次请求",
        "集成7家云服务（华为云OBS/MaaS、阿里云百炼、百度千帆VL/OCR、和风天气、钉钉OpenAPI），核心查询响应提升90%+，连接池利用率从80%降至10%，多级失败降级策略保障系统稳定性"
      ]
    },
    {
      "period": "2026.01 – 至今",
      "projectName": "DocLake — 多源文档数据湖系统",
      "role": "独立开发",
      "descriptions": [
        "面向企业文档智能化场景独立设计的多源文档数据湖系统，采用FastAPI+React三层架构、ARQ异步队列（子进程Worker）、PostgreSQL(pgvector)+MinIO存储分离，部署于阿里云ECS+宝塔面板",
        "实现异构文档→统一Markdown→LLM智能分析→向量化存储→多模态搜索完整流水线，支持PDF/DOCX/DOC/MD/TXT/HTML/XLSX/JPG/PNG等10+格式解析，双引擎抓取（HttpxEngine+PlaywrightEngine）",
        "集成Qwen2.5 7B本地模型（llama.cpp部署），三层JSON容错机制将LLM分析成功率从85%提升至99%+，单文档最多提取18+结构化字段，支持模板库系统与JSONL/CSV/Parquet数据导出"
      ]
    },
    {
      "period": "2026.05 – 2026.06",
      "projectName": "多智能体投标自审系统（AgentScope）",
      "role": "全栈开发",
      "descriptions": [
        "基于AgentScope 2.0.0框架构建的五Agent协作投标自审系统：TenderParserAgent→BidSelfcheckAgent→PriceReviewAgent→RiskAssessmentAgent→ReportGeneratorAgent，七阶段迭代开发",
        "实现Docling+pdfplumber双引擎PDF解析、RuleEngine规则引擎（18条自查规则、四级严重等级、三种匹配模式）、Map-Reduce长文档处理、双轨风险评估（定量加权+LLM综合判断+一票否决）",
        "支持CLI命令行/REST API/Python SDK三种部署方式，全流程可运行（招标PDF输入→Markdown报告输出），AgentScope框架全面合规"
      ]
    },
    {
      "period": "2026.04 – 至今",
      "projectName": "工程资料分类服务",
      "role": "后端核心开发",
      "descriptions": [
        "为建筑工程行业打造的三阶段智能分类管线（L1排除过滤→L2 OCR提取→L3 AI分类），支持PDF电子/扫描版、图片、Word、Excel等多种文件类型，集成阿里百炼+百度千帆VL+百度OCR+华为云OBS",
        "实现筑顺云表单附件自动拉取与增量分类，多PDF分类不一致时AI裁决，自动生成描述并导出.xlsx",
        "五阶段迭代优化（业务聚焦→结构化描述→AI优先重构→测试覆盖从2.4%→18%→代码规范合规），143个测试用例，18%行覆盖率"
      ]
    },
    {
      "period": "2024.06 – 至今",
      "projectName": "Bilibili 视频文稿助手",
      "role": "独立开发者",
      "descriptions": [
        "产品定位：开发专为 Bilibili 平台设计的浏览器扩展，提供智能字幕处理和 AI 内容生成服务，提升用户学习与工作效率。",
        "核心功能：实现 B 站 API 极速字幕获取、Whisper API 无字幕视频语音识别、AI 逐字稿/视频纪要/观点提取；支持时间戳跳转、一键复制、多模型配置。",
        "技术实现：采用 Manifest V3 架构，原生 JavaScript 开发；支持 OpenAI GPT-3.5/4、Claude-3、DeepSeek、豆包、通义千问等 AI 模型；通过 Chrome Storage API 实现数据持久化和智能缓存。"
      ],
      "url": "https://github.com/Hao430/bilibili-video-transcript"
    },
    {
      "period": "2024.01 – 至今",
      "projectName": "南风AI智能聊天应用",
      "role": "独立开发者",
      "descriptions": [
        "架构设计：基于 Next.js 14 + TypeScript 构建，EdgeOne Pages 边缘函数部署，集成 DeepSeek R1 系列大模型，支持实时网络搜索。",
        "功能实现：完整聊天界面与消息管理，流式响应、思考过程可视化、代码高亮、Mermaid 图表渲染；兼容 OpenAI API 接口，支持多模型动态切换。",
        "技术亮点：集成 SearXNG 无追踪搜索引擎，响应式设计适配多设备，边缘节点部署实现全球低延迟访问，支持日均数千次请求。"
      ],
      "url": "ai.hao430.xyz"
    },
    {
      "period": "2025.10 – 2025.12",
      "projectName": "党员管理系统",
      "role": "项目负责人",
      "descriptions": [
        "针对传统党务管理中信息分散、流程繁琐、统计低效等痛点，设计并开发党员管理系统，涵盖10+核心表（党员信息、组织关系、考核记录、党费缴纳等），前后端分离架构（Vue.js+Element UI / Node.js+Express）",
        "开发数据可视化仪表盘（ECharts：党员结构分布、组织生活统计、党费缴纳进度），统计效率提升60%，信息准确性与时效性显著提高",
        "搭建党员发展全流程线上跟踪体系（入党申请→积极分子→发展对象→预备党员→正式党员），实现各环节自动化归档与动态管理"
      ]
    },
    {
      "period": "2025.03 – 2025.10",
      "projectName": "康韵食尚健康餐饮平台",
      "role": "产品负责人",
      "descriptions": [
        "牵头全产业链调研，深度访谈商户15家、供应链企业5家、终端用户近30人，设计并发放调查问卷200份，回收有效问卷186份（回收率93%），输出3万字需求分析报告",
        "构建用户画像标签体系（年龄、饮食偏好、健康目标、消费能力），搭建用户行为数据看板，追踪注册→浏览→下单→复购全链路指标，建立需求-反馈闭环机制",
        "协调产品、设计、开发、运营4个团队，制定项目里程碑与交付计划，荣获贵州省电子商务\"三创赛\"省赛一等奖"
      ]
    },
    {
      "period": "2024.09 – 2025.09",
      "projectName": "\"板凳龙\"数学模型及优化设计",
      "role": "算法开发",
      "descriptions": [
        "基于浙闽民俗\"板凳龙\"运动轨迹优化，结合阿基米德螺线、贝塞尔曲线原理建立数学模型，通过Python实现223节板凳龙全流程运动仿真",
        "模拟退火算法多目标优化（调头路径、螺距、龙头速度），S形最短路径规划+碰撞检测算法，实现300s内数值求解与数据输出",
        "Matplotlib可视化动态仿真与Pandas统计分析，生成优化前后对比报告，荣获数学建模省二等奖"
      ]
    }
  ],
  "workExperiences": [
    {
      "period": "2025.11 – 至今",
      "company": "贵州建工监理咨询有限公司",
      "position": "应用开发实习生",
      "achievements": [
        "深入工地一线调研5次，访谈项目经理与监理工程师，推动技术落地与业务需求精准匹配；在钉钉宜搭低代码平台进行表单设计和集成自动化开发",
        "负责全景图管理模块，设计基于EXIF数据的图片上传方案及MySQL+OBS存储架构，协同实现工程进度可视化管控",
        "推动旧系统迁移到新系统，对项目资料进行智能分类整理；实现标书审查业务智能化改造，对多源数据进行清洗、向量化处理与数据湖建设；定期使用无人机拍摄项目全景图"
      ]
    },
    {
      "period": "2025.05 – 至今",
      "company": "学生党支部",
      "position": "副书记",
      "achievements": [
        "策划主持\"三会一课\"及主题党日活动12次，强化党员理论学习与凝聚力",
        "制定\"红芯成长计划\"与党员实践方案，设计党员积分考核体系（理论学习、志愿服务、学业成绩等维度）",
        "推动党员发展全流程电子化跟踪，实现入党申请→积极分子→发展对象→预备党员→正式党员各环节材料自动归档与提醒功能；负责党支部工作计划、总结、汇报等材料撰写"
      ]
    },
    {
      "period": "2024.05 – 至今",
      "company": "大数据科创协会",
      "position": "会长",
      "achievements": [
        "组建算法集训队与项目小组，吸纳50余名成员，设立算法组、项目组、运维组等小组，制定例会制度、项目管理制度、成果汇报制度",
        "每周组织技术分享会，累计孵化学生项目15个，其中3个获得省级竞赛奖项",
        "对接学院与企业，举办行业讲座8场，覆盖学生500+人次；指导团队成员参加\"互联网+\"、挑战杯等竞赛，累计获得省级奖项5项"
      ]
    }
  ],
  "honors": [
    {
      "name": "电子商务\"三创赛\"省一等奖",
      "level": "省级"
    },
    {
      "name": "\"互联网+\"省金奖",
      "level": "省级"
    },
    {
      "name": "数学建模省二等奖",
      "level": "省级"
    },
    {
      "name": "挑战杯省三等奖",
      "level": "省级"
    },
    {
      "name": "励志奖学金",
      "level": "校级"
    }
  ]
}
