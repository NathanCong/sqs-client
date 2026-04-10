<template>
  <div class="login global-background">
    <CommonBackground />
    <!-- Header -->
    <section class="login-header"><GlobalHeader /></section>
    <!-- Mainer -->
    <section class="login-mainer">
      <div class="mainer-content">
        <div class="login-box">
          <div class="box-header">{{ title }}</div>
          <div class="box-mainer">
            <CommonForm
              layout="horizontal"
              :colon="true"
              :fields="fields"
              ref="commonFormRef"
            />
          </div>
          <div class="box-footer">
            <template v-if="isLogin">
              <a-button type="primary" @click="onLogin">登录</a-button>
              <a-button type="default" @click="onNewRegister">
                新用户注册
              </a-button>
            </template>
            <template v-else>
              <a-button type="primary" @click="onRegister">注册</a-button>
            </template>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import CommonBackground from '@/components/CommonBackground.vue'
import GlobalHeader from '@/components/GlobalHeader'
import CommonForm from '@/components/CommonForm.vue'
import { LOGIN_FORM_FIELDS, REGISTER_FORM_FIELDS } from './constants/index'
import { ref, computed, onMounted } from 'vue'
import { login, register } from '@/apis/index'
import type { LoginParams } from '@/apis/index'
import { notification } from 'ant-design-vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import md5 from 'md5'

const isLogin = ref(true)

const title = computed(() => (isLogin.value ? '用户登录' : '新用户注册'))

const fields = computed(() =>
  isLogin.value ? LOGIN_FORM_FIELDS : REGISTER_FORM_FIELDS
)

const commonFormRef = ref<InstanceType<typeof CommonForm>>()

const route = useRoute()

const router = useRouter()

function jumpRedirect() {
  // 获取重定向地址
  const { redirect = '/' } = route.query
  // 跳转重定向地址
  router.replace({ path: redirect?.toString() })
}

const userStore = useUserStore()

async function onLogin() {
  try {
    const params = await commonFormRef.value?.submit()
    const { userEmail, userPassword } = params as LoginParams
    const { data } = await login({
      userEmail,
      userPassword: md5(userPassword)
    })
    const { success, message: description, data: response } = data
    if (!success) {
      notification.error({ message: '登录失败', description })
      return
    }
    notification.success({ message: '登录成功' })
    const { accessToken } = response
    // 设置 token
    userStore.setAccessToken(accessToken)
    // 跳转页面
    jumpRedirect()
  } catch (error) {
    console.warn('onLogin error', error)
  }
}

function onNewRegister() {
  isLogin.value = false
}

async function onRegister() {
  const params: any = await commonFormRef.value?.submit()
  const { userName, userPhone, userEmail, userPassword, userPasswordConfirm } =
    params
  if (userPassword !== userPasswordConfirm) {
    notification.error({
      message: '注册失败',
      description: '两次密码输入不一致'
    })
    return
  }
  try {
    const { data } = await register({
      userName,
      userPhone,
      userEmail,
      userPassword: md5(userPassword)
    })
    const { success, message } = data
    if (!success) {
      notification.error({ message: '注册失败', description: message })
      return
    }
    notification.success({ message: '注册成功' })
    isLogin.value = true
  } catch (error) {
    console.warn('onRegister error', error)
  }
}

onMounted(() => {
  if (userStore.getAccessToken()) {
    jumpRedirect()
  }
})
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.login-header {
  width: 100%;
  height: 72px;
  position: relative;
  z-index: 999;
}

.login-mainer {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 999;

  .mainer-content {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .login-box {
      width: auto;
      height: auto;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 16px;
      border-radius: 8px;

      .box-header {
        font-size: 18px;
        line-height: 18px;
        font-weight: bold;
        text-align: center;
        padding: 16px 0;
        color: #333;
      }

      .box-mainer {
        flex: 1;
      }

      .box-footer {
        width: 100%;
        height: auto;
      }
    }
  }
}
</style>

<style scoped>
:deep(.ant-btn) {
  width: 100%;
  margin-top: 16px;
}
</style>
