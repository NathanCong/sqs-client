<template>
  <span
    :class="{
      'chat-message': true,
      'user-role': role === 'user',
      'assistant-role': role === 'assistant'
    }"
  >
    <!-- 消息头像 -->
    <span class="message-avator">
      <template v-if="role === 'user'"><UserOutlined /></template>
      <template v-if="role === 'assistant'"><RobotOutlined /></template>
    </span>
    <!-- 消息内容 -->
    <span class="message-content">
      <!-- text 类型 -->
      <template v-if="type === 'text'">
        <span class="message-text">
          <template v-for="(c, i) in contents" :key="i">
            <template v-if="c.type === 'text'">
              <MarkdownRender :markdownContent="String(c.data)" />
            </template>
            <template v-if="c.type === 'tool'">
              <span class="message-tool">
                <span class="tool-header" @click="changeToolVisible(i)">
                  <span class="tool-name">{{ (c.data as Tool).name }}</span>
                  <template v-if="isToolShow(i)">
                    <span class="tool-hide"><UpOutlined /></span>
                  </template>
                  <template v-if="!isToolShow(i)">
                    <span class="tool-show"><DownOutlined /></span>
                  </template>
                </span>
                <template v-if="isToolShow(i)">
                  <span class="tool-mainer">
                    <span class="tool-data">
                      <vue-json-pretty
                        :data="(c.data as Tool).data"
                        :deep="5"
                        :showLength="true"
                        :collapsedOnClickBrackets="true"
                      />
                    </span>
                  </span>
                </template>
              </span>
            </template>
          </template>
        </span>
      </template>
      <!-- list 类型 -->
      <template v-if="type === 'list'">
        <span class="message-list" @click="onListClick">
          <span class="list-icon"><TableOutlined /></span>
          <span class="list-name">{{ (data as List).name }}</span>
        </span>
      </template>
      <!-- pdf 类型 -->
      <template v-if="type === 'pdf'">
        <span class="message-pdf" @click="onPdfClick">
          <span class="pdf-icon"><FilePdfOutlined /></span>
          <span class="pdf-name">{{ (data as Pdf).name }}</span>
        </span>
      </template>
      <!-- 点赞、点踩、复制 -->
      <template v-if="role === 'assistant'">
        <span class="message-actions">
          <button
            class="action-btn"
            :class="{ active: isLiked }"
            @click="onLike"
          >
            <DianZanIcon />
          </button>
          <button
            class="action-btn"
            :class="{ active: isDisliked }"
            @click="onDislike"
          >
            <DianCaiIcon />
          </button>
          <button class="action-btn" @click="onCopy">
            <CopyIcon />
          </button>
        </span>
      </template>
      <!-- 用户评价打分 -->
      <template v-if="showRate">
        <span class="message-rate">
          <a-rate
            v-model:value="score"
            allow-half
            :disabled="isRateDisabled"
            :allow-clear="false"
            @change="onRateChange"
          />
        </span>
      </template>
      <QuestionTypeModal
        @ok="onOk"
        @cancel="onCancel"
        ref="questionTypeModalRef"
      />
    </span>
  </span>
</template>

<script lang="ts">
export interface Tool {
  name: string
  data: JSONDataType
  html?: string
}

export interface Content {
  type: 'text' | 'tool'
  data: string | Tool
}

interface List {
  name: string
  columns: ColumnItem[]
  dataSource: unknown[]
  pagination: Pagination
}

interface Pdf {
  name: string
  url: string
}

export interface ComponentProps {
  id?: string
  role?: 'user' | 'assistant'
  type?: 'text' | 'list' | 'pdf'
  data?: Content[] | List | Pdf
  model?: string
  showRate?: boolean
  score?: number
  questionType?: string
}
</script>

<script lang="ts" setup>
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'
import MarkdownRender from '@/components/MarkdownRender.vue'
import { JSONDataType } from 'vue-json-pretty/types/utils'
import {
  UserOutlined,
  RobotOutlined,
  TableOutlined,
  FilePdfOutlined,
  UpOutlined,
  DownOutlined
} from '@ant-design/icons-vue'
import { computed, ref } from 'vue'
import { useChatStore } from '@/store/chat'
import { useToolStore } from '@/store/tool'
import QuestionTypeModal from './QuestionTypeModal.vue'
import { useUserStore } from '@/store/user'
import { poc } from '@/apis/index'
import { notification } from 'ant-design-vue'
import DianZanIcon from './icons/DianZanIcon.vue'
import DianCaiIcon from './icons/DianCaiIcon.vue'
import CopyIcon from './icons/CopyIcon.vue'

const props = withDefaults(defineProps<ComponentProps>(), {
  id: '',
  role: 'user',
  type: 'text',
  data: () => [],
  questionType: undefined,
  showRate: false,
  score: 0
})

const contents = computed(() => {
  if (props.type === 'text' && Array.isArray(props.data)) {
    return props.data
  }
  return []
})

const toolVisibleMap = ref<Map<number, boolean>>(new Map())

function isToolShow(index: number): boolean {
  return toolVisibleMap.value.get(index) ?? false
}

function changeToolVisible(index: number): void {
  toolVisibleMap.value.set(index, !isToolShow(index))
}

const toolStore = useToolStore()

function onListClick(): void {
  const list = props.data as List
  toolStore.openPreviewPanel('list', {
    columns: list.columns,
    dataSource: list.dataSource,
    total: list.dataSource.length
  })
  console.log('List clicked:', list)
}

function onPdfClick(): void {
  const pdf = props.data as Pdf
  console.log('PDF clicked:', pdf)
}

const chatStore = useChatStore()

const score = ref<number>(props.score || 0)

const isRateDisabled = computed(() => score.value > 0)

const questionTypeModalRef = ref<InstanceType<typeof QuestionTypeModal>>()

function onRateChange(value: number): void {
  // 更新数据
  score.value = value
  // 更新消息
  chatStore.setMessage(props.id, { score: value })
  // 打开问题采集弹窗
  questionTypeModalRef.value?.open()
}

const userStore = useUserStore()

async function onOk(value: string): Promise<void> {
  // 更新消息
  chatStore.setMessage(props.id, { questionType: value })
  // 提交用户评分
  const message = chatStore.getMessage(props.id) as ComponentProps
  const { model = '', questionType = '', score = 0 } = message
  const { userEmail = '' } = userStore.getUserInfo() || {}
  try {
    const { data } = await poc({
      userEmail,
      modelName: model,
      questionType,
      score,
      originData: JSON.stringify(message)
    })
    const { success, message: description } = data
    if (!success) {
      notification.error({ message: '评分提交失败', description })
      return
    }
    notification.success({ message: '评分提交成功' })
  } catch (error) {
    console.warn(error)
  }
}

function onCancel() {
  score.value = 0
  chatStore.setMessage(props.id, {
    score: score.value,
    questionType: undefined
  })
}

// 操作按钮状态
const isLiked = ref(false)
const isDisliked = ref(false)

// 点赞
function onLike() {
  isLiked.value = !isLiked.value
  if (isLiked.value) {
    isDisliked.value = false
    notification.success({ message: '感谢反馈', description: '已记录您的点赞' })
  }
}

// 点踩
function onDislike() {
  isDisliked.value = !isDisliked.value
  if (isDisliked.value) {
    isLiked.value = false
    notification.info({
      message: '感谢反馈',
      description: '已记录您的反馈，我们会持续改进'
    })
  }
}

// 复制回答内容
function onCopy() {
  const currentData = (props.data || []) as Content[]
  const textContent = currentData
    .filter((c) => c.type === 'text')
    .map((c) => c.data)
    .join('\n')

  if (textContent) {
    navigator.clipboard
      .writeText(textContent as string)
      .then(() => {
        notification.success({
          message: '复制成功',
          description: '内容已复制到剪贴板'
        })
      })
      .catch(() => {
        notification.error({
          message: '复制失败',
          description: '请手动复制内容'
        })
      })
  }
}
</script>

<style lang="less" scoped>
.chat-message {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: var(--spacing-md);

  &.user-role {
    justify-content: flex-end;

    .message-content {
      order: 1;
      border-radius: var(--radius-lg) var(--radius-sm) var(--radius-lg)
        var(--radius-lg);
      background: rgba(255, 255, 255, 0.05);

      .message-text,
      .message-list,
      .message-pdf {
        color: var(--text-primary);
      }

      .message-pdf {
        cursor: auto;

        &:hover {
          background-color: transparent;
        }

        &:active {
          background-color: transparent;
        }
      }
    }

    .message-avator {
      order: 2;
      background: transparent;
      border: 2px solid var(--primary-color);
      color: var(--primary-color);
    }
  }

  &.assistant-role {
    justify-content: flex-start;

    .message-avator {
      order: 1;
      background: transparent;
      color: var(--text-secondary);
      border: 2px solid var(--border-color);
    }

    .message-content {
      order: 2;
      border-radius: var(--radius-sm) var(--radius-lg) var(--radius-lg)
        var(--radius-lg);
      background: transparent;

      .message-text,
      .message-list,
      .message-pdf {
        color: var(--text-primary);
      }
    }
  }

  .message-avator {
    width: 40px;
    height: 40px;
    min-width: 40px;
    border-radius: 50%;
    margin-top: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: var(--text-primary);
    transition: all var(--transition-base);

    &:hover {
      transform: scale(1.05);
    }
  }

  .message-content {
    max-width: 70%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: all var(--transition-base);

    .message-text {
      padding: var(--spacing-md) var(--spacing-lg);
      overflow-x: auto;
      word-wrap: break-word;

      .message-tool {
        width: 100%;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        margin: var(--spacing-lg) 0;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        overflow: hidden;

        &:first-child {
          margin-top: 0;
        }

        &:last-child {
          margin-bottom: 0;
        }

        .tool-header {
          width: 100%;
          box-sizing: border-box;
          padding: var(--spacing-md) var(--spacing-lg);
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          background: var(--bg-elevated);
          cursor: pointer;
          transition: all var(--transition-fast);

          &:hover {
            background: var(--card-bg-hover);
          }

          .tool-name {
            font-size: 14px;
            line-height: 1.5;
            font-weight: 600;
            color: var(--text-primary);
          }

          .tool-show,
          .tool-hide {
            width: auto;
            padding-left: var(--spacing-md);
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-secondary);
            transition: color var(--transition-fast);

            &:hover {
              color: var(--primary-color);
            }
          }
        }

        .tool-mainer {
          width: 100%;
          height: auto;
          max-height: 300px;
          box-sizing: border-box;
          padding: var(--spacing-lg);
          display: flex;
          flex-direction: column;
          overflow: hidden;

          .tool-data {
            flex: 1;
            overflow-y: auto;
          }
        }
      }
    }

    .message-list,
    .message-pdf {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      cursor: pointer;
      padding: var(--spacing-lg) var(--spacing-xl);
      transition: all var(--transition-base);
      gap: var(--spacing-md);

      &:hover {
        background: var(--card-bg-hover);
      }

      &:active {
        transform: scale(0.98);
      }

      .list-icon,
      .pdf-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 28px;
        color: var(--primary-color);
      }

      .list-name,
      .pdf-name {
        line-height: 1.5;
        font-size: 15px;
        font-weight: 500;
      }
    }

    .message-actions {
      display: flex;
      gap: var(--spacing-sm);

      .action-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        background: transparent;
        border: none;
        border-radius: var(--radius-sm);
        color: var(--text-secondary);
        cursor: pointer;
        transition: all var(--transition-fast);

        &:hover {
          background: rgba(59, 130, 246, 0.15);
          color: var(--primary-light);
        }

        &.active {
          background: rgba(59, 130, 246, 0.2);
          color: var(--primary-color);

          svg {
            fill: var(--primary-color);
          }
        }

        svg {
          transition: all var(--transition-fast);
        }
      }
    }

    .message-rate {
      display: flex;
      align-items: center;
      padding: 0;
      padding-left: var(--spacing-sm);
      background: transparent;
      transition: all var(--transition-base);
    }
  }
}
</style>
<style scoped>
.message-rate {
  /* 优化星星样式 - 与按钮尺寸一致 */
  :deep(.ant-rate) {
    display: flex;
    align-items: center;
    color: var(--primary-color);
    font-size: 16px;
    line-height: 1;

    .ant-rate-star {
      margin-right: 4px;

      /* 未评分的星星 - 更醒目的空心样式 */
      &.ant-rate-star-zero {
        .ant-rate-star-first,
        .ant-rate-star-second {
          color: rgba(255, 255, 255, 0.4);
        }
      }

      /* 已评分的星星 */
      &:not(.ant-rate-star-zero) {
        .ant-rate-star-first,
        .ant-rate-star-second {
          color: var(--primary-color);
        }
      }
    }

    /* 最后一个星星不需要右边距 */
    .ant-rate-star:last-child {
      margin-right: 0;
    }
  }
}
/* 用户角色特定样式 */
.chat-message.user-role .message-content {
  :deep(.markdown-render) {
    /* 代码块样式 */
    code {
      background: rgba(59, 130, 246, 0.15);
      border-color: var(--primary-color);
      color: var(--text-primary);
    }

    /* 链接颜色 */
    a {
      color: var(--primary-light);
      border-bottom-color: var(--primary-color);

      &:hover {
        color: var(--primary-color);
        border-bottom-color: var(--primary-light);
      }
    }
  }
}
</style>
