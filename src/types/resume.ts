// 简历数据类型定义

export interface ContactInfo {
  email: string
  github: string
}

export interface PersonalInfo {
  name: string
  ethnicity: string
  nativePlace: string
  contact: ContactInfo
  university: string
  college: string
  major: string
}

export interface Skill {
  name: string
  category: 'professional' | 'technical' | 'tools'
}

export interface WorkExperience {
  period: string
  company: string
  position: string
  achievements: string[]
}

export interface ProjectExperience {
  period: string
  projectName: string
  role: string
  descriptions: string[]
  url?: string
}

export interface Honor {
  name: string
  level: string
}

export interface ResumeData {
  personalInfo: PersonalInfo
  skills: Skill[]
  workExperiences: WorkExperience[]
  projectExperiences: ProjectExperience[]
  honors: Honor[]
  professionalSummary: {
    strong: string
    comprehensive: string
    outstanding: string
  }
}