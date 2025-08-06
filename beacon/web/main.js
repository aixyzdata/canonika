import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './src/App.vue';
import routes from './src/routes.js';

const router = createRouter({
  history: createWebHistory(),
  routes
});

const app = createApp(App);
app.use(router);

// Montar o app
app.mount('#app');

// Expor a instância do Vue globalmente para debug
window.app = app;