<template>
  <div class="loading-mask">
    <LoadingOutlined />
  </div>
</template>

<script lang="ts" setup>
import { LoadingOutlined } from '@ant-design/icons-vue'
</script>

<style lang="less" scoped>
.loading-mask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
}
</style>
