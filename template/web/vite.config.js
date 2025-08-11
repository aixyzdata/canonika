import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3790
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "../../shared/styles/scss/main";`
      }
    }
  }
})
