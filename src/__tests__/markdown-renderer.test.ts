import path from 'node:path'
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MarkdownRenderer from '../components/MarkdownRenderer.vue'

/**
 * 排版回归护栏（2026-09-05 正文居中 bug）
 * ------------------------------------------------------------
 * 线上正文曾整体居中：.post-content 位于 .page-header（text-align:center）
 * 内，而 .markdown-body 未显式声明对齐，段落继承居中。
 * 修复是给 .markdown-body 加 text-align:left。
 * 这里直接断言组件源码仍保留该声明——任何人后续删除都会让测试变红。
 */
const SOURCE = readFileSync(path.resolve(__dirname, '../components/MarkdownRenderer.vue'), 'utf-8')

describe('MarkdownRenderer 排版回归', () => {
  it('.markdown-body 显式声明 text-align:left（防 page-header 居中继承）', () => {
    expect(SOURCE).toMatch(/\.markdown-body\s*{[^}]*text-align:\s*left/s)
  })

  it('声明注释保留（说明为什么必须显式声明）', () => {
    expect(SOURCE).toMatch(/继承居中/)
  })

  it('正文外链样式保留：下划线 + 链接色走 CSS 变量', () => {
    const bodyRule = SOURCE.match(/\.markdown-body a\s*{[^}]*}/)?.[0]
    expect(bodyRule).toBeDefined()
    expect(bodyRule).toContain('border-bottom: 1px solid var(--color-link)')
    expect(bodyRule).toContain('var(--color-link)')
  })
})

describe('MarkdownRenderer 渲染行为', () => {
  it('渲染 v-html 内容到 article.markdown-body', () => {
    const wrapper = mount(MarkdownRenderer, {
      props: { html: '<h2 id="sec">Sec</h2><p>正文</p>' },
    })
    expect(wrapper.find('article.markdown-body').exists()).toBe(true)
    expect(wrapper.find('article.markdown-body p').text()).toBe('正文')
    expect(wrapper.find('h2#sec').exists()).toBe(true)
  })

  it('不转义传入的 HTML（已由 markdown-it html:false 兜底）', () => {
    const wrapper = mount(MarkdownRenderer, {
      props: { html: '<p>a <strong>b</strong></p>' },
    })
    expect(wrapper.find('strong').text()).toBe('b')
  })
})
