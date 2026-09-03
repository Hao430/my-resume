import { createApp, watch } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import i18n from './i18n'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)

/* 语言切换时同步 <html lang> —— 海外 SEO / 读屏软件都依赖正确的 lang；
   页面标题由 router/index.ts 的 beforeEach 统一处理。
   注意：不要在组件之外实例化使用组合式 API 的 store（见 stores/resume.ts 注释）。 */
watch(
  () => i18n.global.locale.value,
  (locale) => {
    document.documentElement.lang = locale === 'en' ? 'en' : 'zh-CN'
  },
)

app.mount('#app')
