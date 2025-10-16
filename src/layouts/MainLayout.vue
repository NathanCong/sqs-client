<template>
  <div class="main-layout">
    <section class="main-header">
      <GlobalHeader bg-color="#fff" />
    </section>
    <section class="main-content">
      <slot></slot>
    </section>
  </div>
</template>

<script lang="ts" setup>
import GlobalHeader from '@/components/GlobalHeader'
</script>

<style lang="less" scoped>
.main-layout {
  width: 100%;
  height: 100%;
  // background-color: #999;
  display: flex;
  flex-direction: column;

  .main-header {
    width: 100%;
    height: 60px;
    box-sizing: border-box;
  }

  .main-content {
    flex: 1;
    background-color: #f2f8ff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
