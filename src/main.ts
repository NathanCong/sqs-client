import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import '@/styles/global.less'
import router from '@/router'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

// 日期汉化
dayjs.locale('zh-cn')

// 创建 Vue 实例
const app = createApp(App)
const pinia = createPinia()

// 使用插件
app.use(pinia)
app.use(router)

// 挂载 Vue 实例
app.mount('#app')
