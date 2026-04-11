import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { v4 as createId } from 'uuid'
import type { ComponentProps as ChatMessage } from '@/views/chat/components/ChatModal/components/ChatMessage.vue'
import type { ExecParams } from '@/components/CommandInput.vue'

/**
 * Chat Store（聊天会话数据）
 */
export const useChatStore = defineStore('chat', () => {
  /**
   * State
   */
  const currentChatId = ref<string>('') // 当前聊天id
  const chatHistory = ref<Map<string, ChatMessage[]>>(new Map()) // 聊天历史记录
  const pendingExecParams = ref<ExecParams | null>(null) // 待执行的参数

  /**
   * Getters
   */
  const currentChatList = computed(() => {
    return chatHistory.value.get(currentChatId.value) || []
  })

  /**
   * Actions
   */
  function createNewChat(): string {
    const chatId = createId()
    currentChatId.value = chatId
    chatHistory.value.set(chatId, [])
    console.log('Created new chat with ID:', chatId)
    return chatId
  }

  function addMessage(message: ChatMessage): string {
    const messageId = createId()
    chatHistory.value.get(currentChatId.value)?.push({
      ...message,
      id: messageId
    })
    return messageId
  }

  function getMessage(id: string) {
    return currentChatList.value.find((i) => i.id === id)
  }

  function setMessage(id: string, message: ChatMessage) {
    const index = currentChatList.value.findIndex((i) => i.id === id)
    if (index === -1) {
      return
    }
    currentChatList.value[index] = {
      ...currentChatList.value[index],
      ...message
    }
  }

  function setPendingExecParams(params: ExecParams) {
    pendingExecParams.value = params
  }

  function getPendingExecParams() {
    return pendingExecParams.value
  }

  function clearPendingExecParams() {
    pendingExecParams.value = null
  }

  /**
   * Exports
   */
  return {
    // state
    currentChatId,
    chatHistory,
    // getters
    currentChatList,
    // actions
    createNewChat,
    addMessage,
    getMessage,
    setMessage,
    setPendingExecParams,
    getPendingExecParams,
    clearPendingExecParams
  }
})
