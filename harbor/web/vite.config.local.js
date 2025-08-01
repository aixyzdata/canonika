import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'shared': path.resolve(__dirname, '../../shared'),
      'fisher': path.resolve(__dirname, '../../fisher/web/src'),
      'skipper': path.resolve(__dirname, '../../skipper/web/src'),
      'tollgate': path.resolve(__dirname, '../../tollgate/web/src'),
      'quarter': path.resolve(__dirname, '../../quarter/web/src'),
      'ledger': path.resolve(__dirname, '../../ledger/web/src'),
      'beacon': path.resolve(__dirname, '../../beacon/views'),
      'echo': path.resolve(__dirname, '../../echo/views'),
      'guardian': path.resolve(__dirname, '../../guardian/views'),
      'mapmaker': path.resolve(__dirname, '../../mapmaker/views'),
      'seagull': path.resolve(__dirname, '../../seagull/views'),
      'wayfinder': path.resolve(__dirname, '../../wayfinder/views'),
      'dock': path.resolve(__dirname, '../../dock/views'),
      'diver': path.resolve(__dirname, '../../diver/web/src')
    }
  },
  server: {
    port: 5173,
    host: true,
    strictPort: true,
    hmr: {
      port: 5173,
      overlay: true
    },
    watch: {
      usePolling: true,
      interval: 100
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      }
    }
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['vue', 'vue-router']
  }
}); 