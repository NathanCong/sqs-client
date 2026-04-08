<template>
  <div class="main-layout">
    <section class="main-header">
      <GlobalHeader />
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
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);

  .main-header {
    width: 100%;
    height: 72px;
    box-sizing: border-box;
    position: relative;
    z-index: 100;
  }

  .main-content {
    flex: 1;
    background: var(--bg-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;

    /* 专业渐变背景 */
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background:
        radial-gradient(
          circle at 15% 30%,
          rgba(59, 130, 246, 0.08) 0%,
          transparent 50%
        ),
        radial-gradient(
          circle at 85% 70%,
          rgba(59, 130, 246, 0.06) 0%,
          transparent 50%
        );
      pointer-events: none;
      z-index: 0;
    }

    /* 网格装饰 */
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image:
        linear-gradient(rgba(59, 130, 246, 0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(59, 130, 246, 0.02) 1px, transparent 1px);
      background-size: 40px 40px;
      pointer-events: none;
      z-index: 0;
    }
  }
}
</style>
