<template>
  <div class="home-search">
    <section class="search-input">
      <a-input
        placeholder="需要我做什么？"
        size="large"
        v-model:value="userCommand"
      />
    </section>
    <section class="search-button">
      <a-button type="primary" size="large" @click="onExec()">
        <template #icon><RightCircleOutlined /></template>执行
      </a-button>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { RightCircleOutlined } from '@ant-design/icons-vue'
import { ref } from 'vue'

const userCommand = ref('') // 用户指令

/**
 * 执行函数
 */
const onExec = () => {
  console.log(userCommand.value)
}
</script>

<style lang="less" scoped>
.home-search {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  .search-input {
    width: 660px;

    ::v-deep(.ant-input) {
      height: 48px;
      border-radius: 24px;
      padding: 6px 16px;
      padding-right: calc(100px + 16px);
    }
  }

  .search-button {
    width: auto;
    height: auto;
    position: absolute;
    right: 0;

    ::v-deep(.ant-btn) {
      width: 100px;
      height: 48px;
      border-radius: 24px;
    }
  }
}
</style>
