<template>
  <div class="access">
    <CommonLoading
      mode="full"
      :isLoading="true"
      size="large"
      tip="系统加载中..."
    />
  </div>
</template>

<script lang="ts" setup>
import CommonLoading from '@/components/CommonLoading.vue'
import { useRouter } from 'vue-router'
import { getStorage } from '@/utils/storage'
import { onMounted } from 'vue'

const router = useRouter()

onMounted(() => {
  if (!getStorage('accessToken')) {
    router.replace({ path: '/login' })
    return
  }
  router.replace({ path: '/home' })
})
</script>

<style lang="less" scoped>
.access {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
