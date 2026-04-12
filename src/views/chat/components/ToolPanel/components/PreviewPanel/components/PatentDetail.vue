<template>
  <Teleport to="body">
    <div class="patent-detail" v-if="visible">
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
              <!-- 基本信息 -->
              <template v-if="activeMenu === '1'">
                <section class="base-info-content">
                  <header class="base-info-header">标题及摘要</header>
                  <p class="base-info-row">
                    <span class="row-label">【标题】</span>
                    <span class="row-value">
                      <span class="row-value-original">{{
                        title || '加载中...'
                      }}</span>
                      <span class="row-actions">
                        <a-button
                          type="link"
                          @click="onTitleRewrite"
                          :disabled="!title"
                          >改写</a-button
                        >
                      </span>
                      <template v-if="titleTranslation">
                        <span class="row-value-translation">{{
                          titleTranslation
                        }}</span>
                      </template>
                    </span>
                  </p>
                  <p class="base-info-row">
                    <span class="row-label">【摘要】</span>
                    <span class="row-value">
                      <span class="row-value-original">{{
                        abstract || '加载中...'
                      }}</span>
                      <span class="row-actions">
                        <a-button
                          type="link"
                          @click="onAbstractRewrite"
                          :disabled="!abstract"
                          >改写</a-button
                        >
                      </span>
                      <template v-if="abstractTranslation">
                        <span class="row-value-translation">{{
                          abstractTranslation
                        }}</span>
                      </template>
                    </span>
                  </p>
                </section>
              </template>
              <!-- 权利要求 -->
              <template v-if="activeMenu === '2'">
                <template v-if="claims.length > 0">
                  <section class="claims-content">
                    <template v-for="c in claims" :key="c.id">
                      <p class="claims-row" v-html="c.text"></p>
                    </template>
                  </section>
                </template>
                <template v-else>
                  <CommonEmpty />
                </template>
              </template>
              <!-- 说明书 -->
              <template v-if="activeMenu === '3'">
                <template v-if="descs.length > 0">
                  <section class="desc-content">
                    <template v-for="d in descs" :key="d.id">
                      <p class="desc-row" v-html="d.text"></p>
                    </template>
                  </section>
                </template>
                <template v-else>
                  <CommonEmpty />
                </template>
              </template>
              <!-- 附图 -->
              <template v-if="activeMenu === '4'">
                <template v-if="baseInfo?.new_figures.length > 0">
                  <section class="figure-content">
                    <template
                      v-for="item in baseInfo?.new_figures"
                      :key="item.key"
                    >
                      <img
                        class="figure-item"
                        :src="item.url?.original"
                        alt="附图"
                      />
                    </template>
                  </section>
                </template>
                <template v-else>
                  <CommonEmpty />
                </template>
              </template>
              <!-- PDF -->
              <template v-if="activeMenu === '5'">
                <CommonEmpty />
              </template>
              <!-- 法律信息 -->
              <template v-if="activeMenu === '6'">
                <CommonEmpty />
              </template>
            </div>
          </div>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { CloseCircleOutlined } from '@ant-design/icons-vue'
import CommonEmpty from '@/components/CommonEmpty.vue'
import {
  getPatentBasicInfo,
  getPatentDesc,
  getPatentClaims,
  helperPatentRewriteStream
} from '@/apis'
import { notification } from 'ant-design-vue'
import { useChatStore } from '@/store/chat'

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

const baseInfo = ref<any>(null)
const descs = ref<any[]>([])
const claims = ref<any[]>([])

const title = ref('')
const titleTranslation = ref('')
const abstract = ref('')
const abstractTranslation = ref('')
const originalLanguage = ref('')

async function fetchPatentDetail(id: string) {
  try {
    const { data: basicInfoResponse } = await getPatentBasicInfo({ id })
    const { data: descResponse } = await getPatentDesc({ id })
    const { data: claimsResponse } = await getPatentClaims({ id })
    // 处理基本信息
    const { success: basicInfoSuccess, data: basicInfoData } = basicInfoResponse
    if (!basicInfoSuccess) {
      notification.error({
        message: '获取专利基本信息失败',
        description: basicInfoResponse.message
      })
      return
    }
    baseInfo.value = basicInfoData
    // 处理说明书
    const { success: descSuccess, data: descData } = descResponse
    if (!descSuccess) {
      notification.error({
        message: '获取专利说明书失败',
        description: descResponse.message
      })
      return
    }
    const { descriptions } = descData
    descs.value = descriptions
    // 处理权利要求
    const { success: claimsSuccess, data: claimsData } = claimsResponse
    if (!claimsSuccess) {
      notification.error({
        message: '获取专利权利要求失败',
        description: claimsResponse.message
      })
      return
    }
    claims.value = claimsData.claims
  } catch (error) {
    console.warn(error)
  }
}

const chatStore = useChatStore()

async function fetchPatentRewrite(
  content: string,
  code: string
): Promise<string> {
  let result = ''
  return new Promise((resolve, reject) => {
    helperPatentRewriteStream({
      sessionId: chatStore.currentChatId,
      code,
      question: content,
      onChunk: (chunk) => {
        if (chunk === '[DONE]') {
          return resolve(result)
        }
        result += chunk
      }
    }).catch((err: unknown) => reject(err))
  })
}

async function onTitleRewrite() {
  try {
    titleTranslation.value = ''
    originalLanguage.value = 'zh-cn'
    title.value = await fetchPatentRewrite(title.value, '1')
  } catch (error) {
    console.warn(error)
  }
}

async function onAbstractRewrite() {
  try {
    abstractTranslation.value = ''
    originalLanguage.value = 'zh-cn'
    abstract.value = await fetchPatentRewrite(abstract.value, '3')
  } catch (error) {
    console.warn(error)
  }
}

watch(
  () => baseInfo.value,
  (newBaseInfo) => {
    if (!newBaseInfo) {
      return
    }
    title.value = newBaseInfo.title.original
    abstract.value = newBaseInfo.abstract.original
    originalLanguage.value = newBaseInfo.title.original_lang
  },
  { immediate: true, deep: true }
)

watch(
  () => title.value,
  async (newTitle) => {
    // 标题为空不需要翻译
    if (!newTitle) {
      return
    }
    // 中文不需要翻译
    if (originalLanguage.value === 'zh-cn') {
      return
    }
    try {
      titleTranslation.value = await fetchPatentRewrite(newTitle, '2')
    } catch (error) {
      console.warn(error)
    }
  },
  { immediate: true, deep: true }
)

watch(
  () => abstract.value,
  async (newAbstract) => {
    // 摘要为空不需要翻译
    if (!newAbstract) {
      return
    }
    // 中文不需要翻译
    if (originalLanguage.value === 'zh-cn') {
      return
    }
    try {
      abstractTranslation.value = await fetchPatentRewrite(newAbstract, '4')
    } catch (error) {
      console.warn(error)
    }
  },
  { immediate: true, deep: true }
)

function open(data: any) {
  visible.value = true
  detail.value = data
  fetchPatentDetail(data.id)
}

function close() {
  visible.value = false
  baseInfo.value = null
  descs.value = []
  claims.value = []
  title.value = ''
  titleTranslation.value = ''
  abstract.value = ''
  abstractTranslation.value = ''
  originalLanguage.value = ''
  activeMenu.value = '1'
}

const menuList = ref([
  { key: '1', label: '基本信息' },
  { key: '2', label: '权利要求' },
  { key: '3', label: '说明书' },
  { key: '4', label: '附图' },
  { key: '5', label: 'PDF' },
  { key: '6', label: '法律信息' }
])

const activeMenu = ref('1')

function onMenuClick(key: string) {
  activeMenu.value = key
}

defineExpose({ open, close })
</script>

<style lang="less" scoped>
.patent-detail {
  position: fixed;
  top: 16px;
  right: 16px;
  bottom: 16px;
  left: 16px;
  z-index: 1100;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  color: rgba(0, 0, 0, 0.88);

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

          .base-info-content {
            width: 100%;
            height: auto;

            .base-info-header {
              width: 100%;
              height: auto;
              box-sizing: border-box;
              padding: 8px 16px;
              background-color: #ccc;
              font-weight: bold;
            }

            .base-info-row {
              margin-top: 16px;
              display: flex;
              flex-direction: row;

              .row-label {
                font-weight: bold;
              }

              .row-value {
                flex: 1;
                display: flex;
                flex-direction: column;

                .row-value-original,
                .row-value-translation {
                  font-size: 14px;
                  line-height: 22px;
                  font-weight: normal;
                  border-radius: 8px;
                  padding: 8px 16px;
                  width: 100%;
                  height: auto;
                  box-sizing: border-box;
                  background-color: #f5f5f5;
                }

                .row-value-translation {
                  margin-top: 16px;
                }
              }

              .row-actions {
                display: flex;
                align-items: center;
                justify-content: flex-end;
              }
            }
          }

          .claims-row,
          .desc-row {
            font-size: 16px;
            line-height: 2em;
            font-weight: normal;

            :deep(img) {
              display: inline-block;
              height: 2em;
              width: auto;
              vertical-align: middle;
              object-fit: contain;
            }

            :deep(> img:only-child) {
              height: auto;
              width: auto;
              max-width: 100%;
              vertical-align: baseline;
            }
          }

          .claims-row {
            margin-top: 32px;
          }

          .figure-content {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;

            .figure-item {
              max-width: 400px;
              margin: 16px;
              border: 1px solid #ddd;
            }
          }
        }
      }
    }
  }
}
</style>
