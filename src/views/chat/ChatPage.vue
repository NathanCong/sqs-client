<template>
  <div class="chat">
    <section class="chat-modal-wrapper">
      <ChatModal />
    </section>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import ChatModal from './components/ChatModal'
import { invoke } from '@/apis'

onMounted(() => {
  invoke('你好, 你是谁？你能做什么？')
})
</script>

<style lang="less" scoped>
.chat {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .chat-modal-wrapper {
    width: 80%;
    height: 80%;
  }
}
</style>
