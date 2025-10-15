import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // 根路由
  {
    path: '/',
    redirect: '/home'
  },
  // 首页
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home/HomePage.vue'),
    meta: {
      layout: 'BlankLayout'
    }
  },
  // 聊天页
  {
    path: '/chat',
    name: 'chat',
    component: () => import('@/views/chat/ChatPage.vue'),
    meta: {
      layout: 'MainLayout'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
