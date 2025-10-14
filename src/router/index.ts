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
    component: () => import('@/views/HomeView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
