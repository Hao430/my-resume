import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import MarkdownCleanerPage from '../pages/tools/MarkdownCleanerPage.vue'
import { makeI18n, resetDom } from './helpers'

const CJK = /[一-鿿]/

async function mountCleaner(locale: 'zh' | 'en' = 'zh') {
  const { i18n, composer } = makeI18n(locale)
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/tools', name: 'tools', component: { template: '<div />' } },
      {
        path: '/tools/markdown-cleaner',
        name: 'tool-markdown-cleaner',
        component: MarkdownCleanerPage,
      },
    ],
  })
  router.push('/tools/markdown-cleaner')
  await router.isReady()
  const wrapper = mount(MarkdownCleanerPage, { global: { plugins: [i18n, router] } })
  const input = wrapper.find('textarea.editor:not(.editor--output)')
  const output = wrapper.find('textarea.editor--output')
  return { wrapper, composer, input, output }
}

function checkboxAt(wrapper: ReturnType<typeof mount>, index: number) {
  const box = wrapper.findAll('.option input')[index]
  if (!box) throw new Error(`缺少第 ${index} 个选项开关`)
  return box
}

describe('MarkdownCleanerPage（AI 输出清理器）', () => {
  it('输入即时反映到输出：去 Markdown、压缩空行', async () => {
    resetDom()
    const { wrapper, input, output } = await mountCleaner()
    await input.setValue('## 标题 🎉\n\n\n\n1. **要点**')
    expect((output.element as HTMLTextAreaElement).value).toBe('标题\n\n要点')
    wrapper.unmount()
  })

  it('关闭「去掉 Markdown 格式」后语法被保留', async () => {
    resetDom()
    const { wrapper, input, output } = await mountCleaner()
    await checkboxAt(wrapper, 0).setValue(false)
    await input.setValue('## 标题')
    expect((output.element as HTMLTextAreaElement).value).toBe('## 标题')
    wrapper.unmount()
  })

  it('关闭「去掉 emoji」后 emoji 保留', async () => {
    resetDom()
    const { wrapper, input, output } = await mountCleaner()
    await checkboxAt(wrapper, 1).setValue(false)
    await input.setValue('完成 ✅')
    expect((output.element as HTMLTextAreaElement).value).toBe('完成 ✅')
    wrapper.unmount()
  })

  it('载入示例填入文本，清空按钮复位', async () => {
    resetDom()
    const { wrapper, composer, input } = await mountCleaner()
    const buttons = wrapper.findAll('.panel__actions .btn')
    await buttons[0]?.trigger('click')
    expect((input.element as HTMLTextAreaElement).value).toBe(composer.t('tools.cleaner.sampleText'))

    await buttons[2]?.trigger('click')
    expect((input.element as HTMLTextAreaElement).value).toBe('')
    wrapper.unmount()
  })

  it('统计显示输入/输出字数与缩减比例', async () => {
    resetDom()
    const { wrapper, input } = await mountCleaner()
    await input.setValue('**abcd**') // 8 字符 → 4 字符
    const stats = wrapper.find('.panel__stats').text()
    expect(stats).toContain('8')
    expect(stats).toContain('4')
    expect(stats).toContain('50')
    wrapper.unmount()
  })

  it('HTML 转 Markdown 按钮就地转换输入', async () => {
    resetDom()
    const { wrapper, input } = await mountCleaner()
    await input.setValue('<h2>标题</h2><p>正文</p>')
    await wrapper.findAll('.panel__actions .btn')[1]?.trigger('click')
    expect((input.element as HTMLTextAreaElement).value).toContain('## 标题')
    wrapper.unmount()
  })

  it('英文环境下整页不含中文', async () => {
    resetDom()
    const { wrapper } = await mountCleaner('en')
    expect(CJK.test(wrapper.find('.cleaner-page').text())).toBe(false)
    wrapper.unmount()
  })
})
