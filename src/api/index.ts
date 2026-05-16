const API_BASE = import.meta.env.VITE_API_URL || '/api'

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`)
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

// 只暴露前端需要的读接口
export const api = {
  getResume:        ()                      => get<Record<string, unknown>>('/resume'),
  getResumeSection: (section: string)       => get<{ section: string; data: unknown }>(`/resume/${section}`),
  getPosts:         (tag?: string)          => get<BlogPostListItem[]>(`/posts${tag ? `?tag=${tag}` : ''}`),
  getPost:          (slug: string)          => get<BlogPostDetail>(`/posts/${slug}`),
  getBriefs:        ()                      => get<BriefListItem[]>('/briefs'),
  getBrief:         (date: string)          => get<BriefDetail>(`/briefs/${date}`),
  getSlides:        ()                      => get<SlideListItem[]>('/slides'),
  getSlide:         (slug: string)          => get<SlideDetail>(`/slides/${slug}`),
}

// --- Types ---

export interface BlogPostListItem {
  slug: string
  title: string
  description: string
  date: string
  tags: string[]
  external_url: string | null
}

export interface BlogPostDetail extends BlogPostListItem {
  content_html: string | null
  created_at: string
  updated_at: string
}

export interface BriefListItem {
  date: string
  title: string
  display_date: string
}

export interface BriefDetail extends BriefListItem {
  content_html: string
}

export interface SlideListItem {
  slug: string
  title: string
  description: string
  page_count: number
  date: string
}

export interface SlideDetail extends SlideListItem {
  content_html: string | null
}
