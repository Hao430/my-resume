import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useBlogStore } from './stores/blog'
import { useResumeStore } from './stores/resume'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// 启动时加载全局数据
const blogStore = useBlogStore()
blogStore.fetchPosts()

const resumeStore = useResumeStore()
resumeStore.fetchResume()

app.mount('#app')
