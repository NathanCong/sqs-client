import { postForStream } from '@/utils/request'

/**
 * 大模型对话 API
 */
export function invoke(
  question: string,
  threadId?: string,
  onChunk?: (chunk: string) => void
) {
  // 初始化参数
  const data: InvokeRequestData = {
    input: { question },
    stream: true
  }
  // 存在会话 ID 的情况
  if (threadId) {
    data.config = {
      configurable: { thread_id: threadId }
    }
  }
  return postForStream('http://62.234.188.122:12169/invoke', data, onChunk)
}
