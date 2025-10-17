import { postForStream, post } from '@/utils/request'

/**
 * 提问接口
 */
export function askStream(question: string, onChunk?: (chunk: string) => void) {
  return postForStream('/ask/stream', { question }, onChunk)
}

/**
 * 语义分析接口
 */
export function analysisSemantics(question: string) {
  return post('/analysis/semantics', { question })
}
