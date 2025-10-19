import { defineStore } from 'pinia'
import { v4 as createId } from 'uuid'

export const useChatStore = defineStore('chat', {
  state: () => ({
    currentChatId: '' as string, // 当前聊天id
    chatHistory: {} as ChatHistory // 聊天历史数据
  }),
  getters: {
    // 获取当前聊天
    currentChatList(state) {
      return state.chatHistory[state.currentChatId]
    }
  },
  actions: {
    // 创建新的聊天
    create() {
      this.currentChatId = createId()
      this.chatHistory[this.currentChatId] = []
    },
    // 添加聊天消息
    add(messageRole: string, messageType: string, messageData: unknown) {
      const messageId = createId()
      this.chatHistory[this.currentChatId].push({
        messageId,
        messageRole,
        messageType,
        messageData
      })
      return messageId
    },
    // 更新聊天消息
    update(chatMessageId: string, chatMessageData: unknown) {
      const oldChatMessage = this.currentChatList.find((i) => {
        return i.messageId === chatMessageId
      })
      if (oldChatMessage) {
        oldChatMessage.messageData = chatMessageData
      }
    }
  }
})
