import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import HomeView from './views/HomeView.vue'
import WebSocketView from './views/WebSocketView.vue'
import ApiView from './views/ApiView.vue'
import PushView from './views/PushView.vue'
import EmailView from './views/EmailView.vue'
import SmsView from './views/SmsView.vue'
import VoiceView from './views/VoiceView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/websocket', component: WebSocketView },
    { path: '/api', component: ApiView },
    { path: '/push', component: PushView },
    { path: '/email', component: EmailView },
    { path: '/sms', component: SmsView },
    { path: '/voice', component: VoiceView }
  ]
})

createApp(App).use(router).mount('#app') 