<template>
  <div class="home home-background">
    <section class="home-header">
      <GlobalHeader />
    </section>
    <section class="home-mainer">
      <div class="mainer-content">
        <!-- 系统提示语 -->
        <div class="system-tips">
          <span class="tips-item">Hi，下午好！ 我是您的专属AI助手~</span>
        </div>
        <!-- 搜索栏 -->
        <div class="search-wrapper">
          <HomeSearch />
        </div>
        <!-- 功能快捷入口 -->
        <div class="tools-wrapper">
          <HomeTools />
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import GlobalHeader from '@/components/GlobalHeader'
import HomeSearch from './components/HomeSearch.vue'
import HomeTools from './components/HomeTools.vue'
</script>

<style lang="less" scoped>
.home {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.home-background {
  background-color: #999;
  background-image: url('./assets/images/bg.jpeg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.home-header {
  width: 100%;
  height: 60px;
}

.home-mainer {
  flex: 1;
  // background-color: #999;
  display: flex;
  justify-content: center;
  align-items: center;

  .system-tips,
  .search-wrapper,
  .tools-wrapper {
    width: 100%;
    // background-color: #999;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .system-tips {
    text-align: center;

    .tips-item {
      font-size: 30px;
      font-weight: bold;
    }
  }

  .search-wrapper {
    margin-top: 60px;
  }

  .tools-wrapper {
    margin-top: 60px;
  }
}
</style>
