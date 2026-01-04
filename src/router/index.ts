import { createRouter, createWebHistory } from 'vue-router'
import type { RouteLocationNormalized } from 'vue-router'
import routes from './routes'
import { getStorage } from '@/utils/storage'

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach(
  (to: RouteLocationNormalized, _from: RouteLocationNormalized, next) => {
    const { requiredAccess } = to.meta
    console.log('requiredAccess', requiredAccess)
    const isLogin = Boolean(getStorage('accessToken'))
    console.log('isLogin', isLogin)
    // 需要登录，但未登录
    if (requiredAccess && !isLogin) {
      next({ name: 'login', query: { redirect: to.fullPath } })
      return
    }
    next()
  }
)

export default router
