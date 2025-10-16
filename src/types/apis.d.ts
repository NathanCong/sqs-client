interface InvokeRequestData {
  input: {
    question: string
  }
  config?: {
    configurable: {
      thread_id: string // 可选：会话ID，用于区分不同对话线程
    }
  }
  stream: boolean // 是否使用流式输出（true: 逐词返回; false: 一次性返回完整答案）
}
