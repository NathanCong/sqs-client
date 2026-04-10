<template>
  <div class="parent-detail" v-if="visible">
    <section class="detail-header">
      <span class="header-titlt">专利详情</span>
      <span class="header-close" @click="close"><CloseCircleOutlined /></span>
    </section>
    <section class="detail-mainer">
      <div class="mainer-info">
        <span class="info-title">
          <span class="title-item">{{ detail.applicationNumber }}</span>
          <span class="title-item">{{ detail.patentName }}</span>
        </span>
        <span class="info-applicant">{{ detail.initialApplicant }}</span>
      </div>
      <div class="mainer-body">
        <div class="body-sidebar">
          <template v-for="m in menuList" :key="m.key">
            <span
              class="menu-item"
              :class="{ active: activeMenu === m.key }"
              @click="onMenuClick(m.key)"
              >{{ m.label }}</span
            >
          </template>
        </div>
        <div class="body-content">
          <div class="content-scroll">
            <template v-if="activeMenu === '3' && descs.length > 0">
              <template v-for="d in descs" :key="d.id">
                <p class="desc-row">{{ d.text }}</p>
              </template>
            </template>
            <template v-else><CommonEmpty /></template>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { CloseCircleOutlined } from '@ant-design/icons-vue'
import CommonEmpty from '@/components/CommonEmpty.vue'
import { getPatentManual } from '@/apis'

const visible = ref(false)

const detail = ref<{
  applicationNumber: string
  patentName: string
  initialApplicant: string
}>({
  applicationNumber: '',
  patentName: '',
  initialApplicant: ''
})

const descs = ref<any[]>([])

async function fetchPatentManual(id: string) {
  try {
    const { data } = await getPatentManual({ id })
    const { data: response } = data
    const { descriptions } = response
    descs.value = descriptions
    console.log('descriptions', descriptions)
  } catch (error) {
    console.warn(error)
  }
}

function open(data: any) {
  visible.value = true
  detail.value = data
  fetchPatentManual(data.id)
}

function close() {
  visible.value = false
  descs.value = []
  activeMenu.value = '3'
}

const menuList = ref([
  { key: '1', label: '基本信息' },
  { key: '2', label: '权利要求' },
  { key: '3', label: '说明书' },
  { key: '4', label: '附图' },
  { key: '5', label: 'PDF' },
  { key: '6', label: '法律信息' }
])

const activeMenu = ref('3')

function onMenuClick(key: string) {
  activeMenu.value = key
}

defineExpose({ open, close })
</script>

<style lang="less" scoped>
.parent-detail {
  position: fixed;
  top: 16px;
  right: 16px;
  bottom: 16px;
  left: 16px;
  z-index: 1000;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;

  .detail-header {
    width: 100%;
    height: auto;
    box-sizing: border-box;
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header-titlt {
      font-size: 16px;
      line-height: 16px;
      font-weight: bold;
    }

    .header-close {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      line-height: 22px;
      cursor: pointer;
    }
  }

  .detail-mainer {
    flex: 1;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 16px;
    padding-top: 0;

    .mainer-info {
      width: 100%;
      height: auto;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-sizing: border-box;
      padding: 16px;
      display: flex;
      flex-direction: column;

      .info-title {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;

        .title-item {
          margin-right: 8px;
          font-size: 14px;
          line-height: 22px;
          font-weight: bold;
        }
      }

      .info-applicant {
        font-size: 14px;
        line-height: 22px;
        font-weight: normal;
      }
    }

    .mainer-body {
      flex: 1;
      display: flex;
      flex-direction: row;
      padding-top: 16px;

      .body-sidebar {
        width: 120px;
        height: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        padding: 0 16px;

        .menu-item {
          width: 100%;
          height: auto;
          display: flex;
          align-content: center;
          justify-content: center;
          padding: 16px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: bold;

          &:hover {
            background-color: #f5f5f5;
          }

          &:active {
            background-color: #eee;
          }

          &.active {
            background-color: #ccc;
          }
        }
      }

      .body-content {
        flex: 1;
        position: relative;

        .content-scroll {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 16px;
          overflow: auto;

          .desc-row {
            font-size: 14px;
            line-height: 22px;
            font-weight: normal;
          }
        }
      }
    }
  }
}
</style>
