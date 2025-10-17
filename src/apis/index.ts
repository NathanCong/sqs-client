import { postForStream } from '@/utils/request'

/**
 * 问题咨询接口
 */
export function ask(question: string, onChunk?: (chunk: string) => void) {
  return postForStream('/ask/stream', { question }, onChunk)
}
