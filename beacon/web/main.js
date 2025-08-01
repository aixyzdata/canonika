import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './src/App.vue';
import BeaconView from './src/views/BeaconView.vue';
import StatusView from './src/views/StatusView.vue';

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      name: 'Beacon',
      component: BeaconView
    },
    {
      path: '/status',
      name: 'Status',
      component: StatusView
    }
  ]
});

createApp(App).use(router).mount('#app');