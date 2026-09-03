/**
 * 演示文稿清单（纯静态）
 * 新增：把演示 HTML 放进 public/slides/，再在此处登记一行即可。
 */
export interface Slide {
  /** 唯一标识，同时是 /slides/:id 路由参数 */
  id: string
  title: string
  titleEn?: string
  description: string
  descriptionEn?: string
  date: string
  /** 页数（仅用于展示） */
  slides: number
  /** 站点内路径，指向 public 下的静态文件 */
  url: string
}

export const slidesData: Slide[] = []
