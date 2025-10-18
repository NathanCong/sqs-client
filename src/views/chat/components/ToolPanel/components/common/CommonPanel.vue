<template>
  <div class="common-panel">
    <template v-if="showHeader">
      <section class="panel-header">
        <span class="header-title">{{ title }}</span>
        <span class="header-buttons"><slot name="header-buttons"></slot></span>
      </section>
    </template>
    <section class="panel-mainer">
      <div class="panel-scroll">
        <slot></slot>
      </div>
    </section>
    <template v-if="showFooter">
      <section class="panel-footer">
        <slot name="footer-buttons"></slot>
      </section>
    </template>
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    showHeader?: boolean
    title?: string
    showFooter?: boolean
  }>(),
  {
    showHeader: true,
    title: '默认标题',
    showFooter: true
  }
)
</script>

<style lang="less" scoped>
.common-panel {
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .panel-header {
    width: 100%;
    box-sizing: border-box;
    padding: 16px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header-title {
      font-size: 18px;
      font-weight: bold;
    }
  }

  .panel-mainer {
    flex: 1;
    // background-color: #999;
    position: relative;

    .panel-scroll {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      overflow-y: auto;
      overflow-x: hidden;
    }
  }

  .panel-footer {
    width: 100%;
    height: 60px;
    background-color: #fff;
    border-top: 1px solid #eee;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    box-sizing: border-box;
    padding: 16px;
  }
}
</style>
