import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import { staticSitePlugin } from './build/static-site'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    ...(process.env.NODE_ENV === 'production' || process.env.npm_lifecycle_event?.includes('build')
      ? []
      : [vueDevTools()]),
    staticSitePlugin(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    // 纯静态站点：无后端，开发服务器不需要 API 代理
    host: true,
  },
})
