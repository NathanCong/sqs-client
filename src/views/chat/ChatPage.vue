<template>
  <div class="chat">
    <section class="chat-modal-wrapper">
      <ChatModal />
    </section>
  </div>
</template>

<script lang="ts" setup>
import ChatModal from './components/ChatModal.vue'
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
