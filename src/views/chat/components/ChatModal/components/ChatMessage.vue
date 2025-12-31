<template>
  <span
    :class="{
      'chat-message': true,
      'user-role': role === 'user',
      'assistant-role': role === 'assistant'
    }"
  >
    <!-- 消息头像 -->
    <span class="message-avator"></span>
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
                <span class="tool-header">
                  <span class="tool-name">{{ (c.data as Tool).name }}</span>
                  <template v-if="isToolShow(i)">
                    <span class="tool-hide" @click="onToolHide(i)">
                      <UpOutlined />
                    </span>
                  </template>
                  <template v-if="!isToolShow(i)">
                    <span class="tool-show" @click="onToolShow(i)">
                      <DownOutlined />
                    </span>
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
      <!-- 用户评价星 -->
      <template v-if="showRate">
        <span class="message-rate">
          <a-rate
            v-model:value="rateValue"
            allow-half
            :allow-clear="false"
            @change="onRateChange"
          />
        </span>
      </template>
    </span>
  </span>
</template>

<script lang="ts">
interface Tool {
  name: string
  data: JSONDataType
}

interface Content {
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

interface ComponentProps {
  id: string
  role: 'user' | 'assistant'
  type: 'text' | 'list' | 'pdf'
  data?: Content[] | List | Pdf
  showRate?: boolean
  rate?: number
}
</script>

<script lang="ts" setup>
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'
import MarkdownRender from '@/components/MarkdownRender.vue'
import { JSONDataType } from 'vue-json-pretty/types/utils'
import {
  TableOutlined,
  FilePdfOutlined,
  UpOutlined,
  DownOutlined
} from '@ant-design/icons-vue'
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<ComponentProps>(), {
  role: 'user',
  type: 'text',
  data: () => [],
  showRate: false
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

function onToolShow(index: number): void {
  toolVisibleMap.value.set(index, true)
}

function onToolHide(index: number): void {
  toolVisibleMap.value.set(index, false)
}

function onListClick(): void {
  const list = props.data as List
  console.log('List clicked:', list)
}

function onPdfClick(): void {
  const pdf = props.data as Pdf
  console.log('PDF clicked:', pdf)
}

const rateValue = ref<number>(props.rate || 0)

function onRateChange(value: number): void {
  rateValue.value = value
  console.log('Rating changed:', value)
}
</script>

<style lang="less" scoped>
.chat-message {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;

  &.user-role {
    justify-content: flex-end;

    .message-content {
      order: 1;
      border-radius: 20px 8px 20px 20px;
      background: #1677ff;
      margin-right: 8px;

      .message-text,
      .message-list,
      .message-pdf {
        color: #fff;
      }
    }

    .message-avator {
      order: 2;
      background-color: rgba(255, 0, 255, 0.5);
    }
  }

  &.assistant-role {
    justify-content: flex-start;

    .message-avator {
      order: 1;
      background-color: rgba(0, 0, 255, 0.5);
    }

    .message-content {
      order: 2;
      border-radius: 8px 20px 20px 20px;
      border: 1px solid #d9d9d9;
      background-color: #fff;
      margin-left: 8px;

      .message-text,
      .message-list,
      .message-pdf {
        color: initial;
      }
    }
  }

  .message-avator {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }

  .message-content {
    max-width: 50%;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .message-text {
      padding: 16px;

      .message-tool {
        width: 100%;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        margin-top: 16px;
        margin-bottom: 16px;
        background-color: #fafafa;
        border-radius: 8px;

        &:first-child {
          margin-top: 0;
        }

        &:last-child {
          margin-bottom: 0;
        }

        .tool-header {
          width: 100%;
          box-sizing: border-box;
          padding: 16px 0;
          padding-left: 16px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          background-color: #eee;
          border-radius: 8px;

          .tool-name {
            font-size: 16px;
            font-weight: bold;
          }

          .tool-show,
          .tool-hide {
            cursor: pointer;
            height: auto;
            padding: 0 16px;
          }
        }

        .tool-mainer {
          width: 100%;
          height: auto;
          box-sizing: border-box;
          padding: 16px;
          max-height: 300px;
          overflow-y: auto;
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
      padding: 16px;

      &:hover {
        background-color: #f5f5f5;
      }

      &:active {
        background-color: #e6e6e6;
      }

      .list-icon,
      .pdf-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 32px;
        margin-right: 8px;
      }

      .list-name,
      .pdf-name {
        line-height: 32px;
      }
    }

    .message-rate {
      padding: 16px;
      border-top: 1px solid #eee;
    }
  }
}
</style>
