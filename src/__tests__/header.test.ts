import { describe, expect, it } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import Header from '../components/Header.vue'
import { makeI18n, resetDom } from './helpers'

function mountHeader(locale: 'zh' | 'en' = 'zh', currentPath = '/') {
  const { i18n } = makeI18n(locale)
  const wrapper = mount(Header, {
    global: {
      plugins: [i18n],
      stubs: {
        RouterLink: RouterLinkStub,
      },
      mocks: {
        $route: { path: currentPath },
      },
    },
  })
  return { wrapper, i18n }
}

describe('Header 导航', () => {
  it('渲染 5 个主要导航项（中文）', () => {
    resetDom()
    const { wrapper } = mountHeader('zh')
    const labels = wrapper.findAll('.header__nav-item').map((n) => n.text())
    expect(labels).toEqual(['首页', '关于', '博客', '服务', '早参'])
    wrapper.unmount()
  })

  it('渲染 5 个主要导航项（英文）', () => {
    resetDom()
    const { wrapper } = mountHeader('en')
    const labels = wrapper.findAll('.header__nav-item').map((n) => n.text())
    expect(labels).toEqual(['Home', 'About', 'Blog', 'Services', 'Daily Brief'])
    wrapper.unmount()
  })

  it('当前路由对应项高亮', () => {
    resetDom()
    const { wrapper } = mountHeader('zh', '/about')
    const active = wrapper.findAll('.header__nav-item--active')
    expect(active).toHaveLength(1)
    expect(active[0]?.text()).toBe('关于')
    wrapper.unmount()
  })

  it('联系人按钮指向站内邮箱', () => {
    resetDom()
    const { wrapper } = mountHeader()
    const contact = wrapper.find('a.header__contact')
    expect(contact.attributes('href')).toBe('mailto:fervent430@163.com')
    wrapper.unmount()
  })
})

describe('Header 移动端菜单', () => {
  it('默认收起，点击汉堡按钮展开', async () => {
    resetDom()
    const { wrapper } = mountHeader()
    expect(wrapper.find('.header__mobile-menu--open').exists()).toBe(false)

    await wrapper.find('button.header__mobile-toggle').trigger('click')
    expect(wrapper.find('.header__mobile-menu--open').exists()).toBe(true)

    // 再点一次收起
    await wrapper.find('button.header__mobile-toggle').trigger('click')
    expect(wrapper.find('.header__mobile-menu--open').exists()).toBe(false)
    wrapper.unmount()
  })

  it('点击移动端导航项后菜单关闭', async () => {
    resetDom()
    const { wrapper } = mountHeader()

    await wrapper.find('button.header__mobile-toggle').trigger('click')
    expect(wrapper.find('.header__mobile-menu--open').exists()).toBe(true)

    const firstNav = wrapper.find('.header__mobile-nav-item')
    await firstNav.trigger('click')
    expect(wrapper.find('.header__mobile-menu--open').exists()).toBe(false)
    wrapper.unmount()
  })

  it('移动端菜单内有语言切换器', async () => {
    resetDom()
    const { wrapper } = mountHeader()
    await wrapper.find('button.header__mobile-toggle').trigger('click')
    expect(wrapper.find('.header__mobile-lang .lang-switcher').exists()).toBe(true)
    wrapper.unmount()
  })
})
