import { readFileSync, readdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { db } from '../db/index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = resolve(__dirname, '../../..')

// ---------------------------------------------------------------
// 1. Resume data: read resume-data.json → split by section
// ---------------------------------------------------------------
async function seedResume() {
  const jsonPath = resolve(PROJECT_ROOT, 'resume-data.json')
  const raw = JSON.parse(readFileSync(jsonPath, 'utf-8'))

  const sections: Record<string, unknown> = {
    personal_info: raw.personalInfo,
    summary: raw.professionalSummary,
    skills: raw.skills,
    projects: raw.projectExperiences,
    experience: raw.workExperiences,
    honors: raw.honors,
  }

  for (const [section, data] of Object.entries(sections)) {
    await db.query(
      `INSERT INTO resume (section, data)
       VALUES ($1, $2)
       ON CONFLICT (section) DO UPDATE SET data = $2, updated_at = NOW()`,
      [section, JSON.stringify(data)]
    )
  }
  console.log(`  ✓ resume: ${Object.keys(sections).length} sections`)
}

// ---------------------------------------------------------------
// 2. Blog posts
// ---------------------------------------------------------------
interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  tags: string[]
  externalUrl?: string
  contentHtml?: string
}

async function seedBlogPosts() {
  const posts: BlogPost[] = [
    {
      slug: 'xin-fazhan-linian',
      title: '新发展理念的个人视角',
      description: '以创新、协调、绿色、开放、共享五大理念为框架，探讨个人成长与时代发展的同频共振。',
      date: '2026-04-09',
      tags: ['思想', '发展'],
      externalUrl: '/read?file=新发展理念的个人视角.html',
    },
    {
      slug: 'harness-gong-ju-tuijian',
      title: 'Harness开发范式的工具推荐',
      description: '分享我在日常开发中使用的效率工具，从AI助手到部署平台，构建个人工具链。',
      date: '2026-04-09',
      tags: ['工具', '效率', 'AI'],
      externalUrl: '/read?file=Harness开发范式的工具推荐.html',
    },
    {
      slug: 'workbuddy-esa-jianshan',
      title: '我是如何用WorkBuddy结合ESA开发本网站的',
      description: '从需求分析到自动部署，完整记录AI辅助开发简历网站的全过程。',
      date: '2026-04-09',
      tags: ['开发', 'AI', 'WorkBuddy'],
      externalUrl: '/read?file=WorkBuddy结合ESA开发网站实战.html',
    },
    {
      slug: 'faxian-shenghuo-xuqiu',
      title: '如何发现生活中的需求',
      description: '分享4种需求发现方法：痛点驱动、角色代入、数据挖掘、跨界借鉴。',
      date: '2026-04-09',
      tags: ['产品', '思考', '方法论'],
      externalUrl: '/read?file=如何发现生活中的需求.html',
    },
  ]

  for (const post of posts) {
    await db.query(
      `INSERT INTO blog_posts (slug, title, description, date, tags, external_url, content_html)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (slug) DO NOTHING`,
      [post.slug, post.title, post.description, post.date, post.tags, post.externalUrl || null, post.contentHtml || null]
    )
  }
  console.log(`  ✓ blog_posts: ${posts.length} posts`)
}

// ---------------------------------------------------------------
// 3. Slides
// ---------------------------------------------------------------
interface Slide {
  slug: string
  title: string
  description: string
  pageCount: number
  date: string
}

async function seedSlides() {
  const slides: Slide[] = [
    {
      slug: 'xin-fazhan-linian',
      title: '新发展理念的个人视角',
      description: '以创新、协调、绿色、开放、共享五大理念为框架，探讨个人成长与时代发展的同频共振。',
      pageCount: 8,
      date: '2026-04-09',
    },
  ]

  for (const slide of slides) {
    await db.query(
      `INSERT INTO slides (slug, title, description, page_count, date)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (slug) DO NOTHING`,
      [slide.slug, slide.title, slide.description, slide.pageCount, slide.date]
    )
  }
  console.log(`  ✓ slides: ${slides.length} slides`)
}

// ---------------------------------------------------------------
// 4. Daily briefs: scan public/每日早参/*.html
// ---------------------------------------------------------------
function parseDateFromFilename(filename: string): string | null {
  const match = filename.match(/article_(\d{4})(\d{2})(\d{2})\.html$/)
  return match ? `${match[1]}-${match[2]}-${match[3]}` : null
}

function formatDisplayDate(dateStr: string): string {
  const [, month, day] = dateStr.split('-')
  return `${parseInt(month)}月${parseInt(day)}日`
}

function getWeekday(dateStr: string): string {
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return weekdays[new Date(dateStr).getDay()]
}

async function seedDailyBriefs() {
  const briefsDir = resolve(PROJECT_ROOT, 'public/每日早参')

  let files: string[]
  try {
    files = readdirSync(briefsDir)
      .filter(f => /^article_\d{8}\.html$/.test(f))
      .sort()
  } catch {
    console.log('  ⚠  daily_briefs: directory not found, skipping')
    return
  }

  let count = 0
  for (const file of files) {
    const dateStr = parseDateFromFilename(file)
    if (!dateStr) continue

    const html = readFileSync(resolve(briefsDir, file), 'utf-8')
    const titleMatch = html.match(/<title>(.*?)<\/title>/i)
    const title = titleMatch ? titleMatch[1].trim() : file.replace('.html', '')

    await db.query(
      `INSERT INTO daily_briefs (date, title, content_html, display_date)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (date) DO NOTHING`,
      [dateStr, title, html, `${formatDisplayDate(dateStr)} ${getWeekday(dateStr)}`]
    )
    count++
  }
  console.log(`  ✓ daily_briefs: ${count} briefs`)
}

// ---------------------------------------------------------------
// Main
// ---------------------------------------------------------------
async function main() {
  console.log('Seeding database...\n')

  try {
    await seedResume()
    await seedBlogPosts()
    await seedSlides()
    await seedDailyBriefs()

    console.log('\n✓ All seed data inserted successfully')
  } catch (err) {
    console.error('\n✗ Seed failed:', err)
    process.exit(1)
  } finally {
    await db.end()
  }
}

main()
