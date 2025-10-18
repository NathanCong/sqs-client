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

/**
 * 技术交底书撰写
 */
export function helperDisclosureStream(
  question: string,
  onChunk?: (chunk: string) => void
) {
  return postForStream('/helper/disclosure/stream', { question }, onChunk)
}

/**
 * 专利撰写
 */
export function helperPatentStream(
  question: string,
  onChunk?: (chunk: string) => void
) {
  return postForStream('/helper/patent/stream', { question }, onChunk)
}
