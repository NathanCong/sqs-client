<template>
  <div class="chat-modal">
    <section class="chat-header">
      <span class="chat-title">AI助手</span>
    </section>
    <section class="chat-content">
      <ul class="chat-list" ref="chatListRef">
        <li
          :class="{
            'chat-message': true,
            'user-role': chatMessage.messageRole === 'user',
            'assistant-role': chatMessage.messageRole === 'assistant'
          }"
          v-for="chatMessage in chatList"
          :key="chatMessage.messageId"
        >
          <span class="message-avator"></span>
          <span class="message-content">
            <!-- 工具展示 -->
            <template v-if="chatMessage.toolResult">
              <span class="message-tool" @click="handleChangeToolShow">
                <span class="tool-name">
                  {{ getToolName(chatMessage.toolResult) }}
                </span>
                <span class="tool-data" v-if="isToolShow">
                  <vue-json-pretty
                    :data="getToolData(chatMessage.toolResult)"
                    :deep="3"
                    :showLength="true"
                    :collapsedOnClickBrackets="true"
                  />
                </span>
              </span>
            </template>
            <!-- 文字消息类型 -->
            <template v-if="chatMessage.messageType === 'text'">
              <span class="message-text">
                <MarkdownRender
                  :markdownContent="String(chatMessage.messageData)"
                />
              </span>
            </template>
            <!-- 其他消息类型 -->
          </span>
        </li>
      </ul>
    </section>
    <section class="chat-footer">
      <CommandInput :execDisabled="execDisabled" @exec="onExec" />
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick } from 'vue'
import MarkdownRender from '@/components/MarkdownRender.vue'
import CommandInput from '@/components/CommandInput.vue'
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'

withDefaults(
  defineProps<{ chatList?: ChatMessage[]; execDisabled?: boolean }>(),
  {
    chatList: () => [],
    execDisabled: false
  }
)

const chatListRef = ref<Element | null>(null)

const isToolShow = ref(false)

function handleChangeToolShow() {
  isToolShow.value = !isToolShow.value
}

const emit = defineEmits(['exec'])

function onExec(params: CommandInputExecParams) {
  emit('exec', params)
}

function scrollToBottom() {
  nextTick(() => {
    if (chatListRef.value) {
      chatListRef.value.scrollTop = chatListRef.value.scrollHeight
    }
  })
}

function getToolName(toolResult: string) {
  const regex = /<name>([\s\S]*?)<\/name>/g
  const matches = regex.exec(toolResult)
  if (matches) {
    console.log('matches', matches)
    return matches[1]
  }
  return ''
}

function getToolData(toolResult: string) {
  const regex = /<output>([\s\S]*?)<\/output>/g
  const matches = regex.exec(toolResult)
  let toolData = {}
  if (matches) {
    try {
      toolData = JSON.parse(matches[1])
    } catch (err) {
      console.warn(err)
    }
  }
  return toolData
}

defineExpose({ scrollToBottom })
</script>

<style lang="less" scoped>
.chat-modal {
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 20px;
  display: flex;
  flex-direction: column;

  .chat-header {
    width: 100%;
    box-sizing: border-box;
    padding: 16px;
    border-bottom: 1px solid #eee;

    .chat-title {
      font-size: 18px;
      font-weight: bold;
    }
  }

  .chat-content {
    flex: 1;
    position: relative;
    // background-color: #999;

    .chat-list {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      overflow-y: auto;
      overflow-x: hidden;
      box-sizing: border-box;
      padding: 16px;
      display: flex;
      flex-direction: column;
      background-color: #fcfcfc;

      .chat-message {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        margin-bottom: 16px;

        &:last-child {
          margin-bottom: 0;
        }

        &.user-role {
          justify-content: flex-end;

          .message-content {
            order: 1;
            border-radius: 20px 8px 20px 20px;
            background: #1677ff;
            margin-right: 8px;

            .message-text {
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

            .message-text {
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
          padding: 16px;
          max-width: 50%;
        }

        .message-tool {
          width: 100%;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          padding: 16px;
          background-color: #eee;
          border-radius: 8px;
          margin-bottom: 16px;

          .tool-name {
            font-size: 16px;
            font-weight: bold;
            // padding-bottom: 16px;
            cursor: pointer;
          }
        }
      }
    }
  }

  .chat-footer {
    width: 100%;
    box-sizing: border-box;
    padding: 16px;
    border-top: 1px solid #eee;
  }
}
</style>
