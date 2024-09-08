import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import basicSsl from '@vitejs/plugin-basic-ssl'
import path from 'path'
import { pluginHttp2Proxy } from './pluginHttp2Proxy'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), basicSsl(), pluginHttp2Proxy()],
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
  server: {
    port: 8080,
    host: '0.0.0.0',
    https: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3030',
        ws: true,
      },
    },
  },
  css: {
    devSourcemap: true,
  },
})
