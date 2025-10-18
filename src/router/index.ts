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
  // 主功能页
  {
    path: '/chat',
    name: 'chat',
    component: () => import('@/views/chat/ChatPage.vue'),
    meta: {
      layout: 'MainLayout'
    }
  },
  // 通配符路由 - 匹配所有未找到的路由，默认跳转到首页
  {
    path: '/:pathMatch(.*)*',
    redirect: '/home'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
