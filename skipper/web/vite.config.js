import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  root: 'src',
  publicDir: '../public',
  server: {
    port: 3000,
    host: '0.0.0.0'
  },
  build: {
    outDir: '../dist',
    assetsDir: 'assets',
    emptyOutDir: true
  }
});