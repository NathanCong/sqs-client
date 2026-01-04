/**
 * Routes
 */
export default [
  // 根
  {
    path: '/',
    redirect: '/home'
  },
  // 登录
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/LoginPage.vue'),
    meta: {
      layout: 'BlankLayout'
    }
  },
  // 首页
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home/HomePage.vue'),
    meta: {
      layout: 'BlankLayout',
      requiredAccess: true
    }
  },
  // 问答
  {
    path: '/chat',
    name: 'chat',
    component: () => import('@/views/chat/ChatPage.vue'),
    meta: {
      layout: 'MainLayout',
      requiredAccess: true
    }
  },
  // 通配符路由 - 匹配所有未找到的路由，默认跳转到根目录
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]
