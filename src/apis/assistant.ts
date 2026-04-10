import { postForStream, post } from '@/utils/request'
import type { AxiosResponse } from 'axios'

/**
 * 大模型：聊天接口
 */
export function chatStream({
  sessionId,
  question,
  fileUrl,
  onChunk
}: {
  sessionId?: string
  question: string
  fileUrl?: string
  onChunk?: (chunk: string) => void
}) {
  return postForStream(
    '/assistant/chat/stream',
    { session_id: sessionId, question, file_url: fileUrl },
    onChunk
  )
}

/**
 * 大模型：专利交底书撰写接口
 */
export function helperDisclosureStream({
  sessionId,
  question,
  fileUrl,
  code,
  onChunk
}: {
  sessionId?: string
  question: string
  fileUrl?: string
  code: string
  onChunk?: (chunk: string) => void
}) {
  return postForStream(
    '/assistant/helper/disclosure/stream',
    {
      session_id: sessionId,
      question: question,
      file_url: fileUrl,
      code
    },
    onChunk
  )
}

/**
 * 大模型：专利改写接口
 */
export function helperPatentRewriteStream({
  sessionId,
  question,
  fileUrl,
  code,
  onChunk
}: {
  sessionId?: string
  question: string
  fileUrl?: string
  code: string
  onChunk?: (chunk: string) => void
}) {
  return postForStream(
    '/assistant/helper/patent/rewrite/stream',
    {
      session_id: sessionId,
      question: question,
      file_url: fileUrl,
      code
    },
    onChunk
  )
}

/**
 * 交底书查新接口
 */
export function searchDisclosure({
  sessionId,
  question,
  fileUrl
}: {
  sessionId?: string
  question: string
  fileUrl?: string
}): Promise<AxiosResponse<unknown>> {
  return post('/assistant/search/disclosure', {
    session_id: sessionId,
    question,
    file_url: fileUrl
  })
}

/**
 * 专利撰写接口
 */
export function helperPatentStream({
  sessionId,
  question,
  fileUrl,
  code,
  onChunk
}: {
  sessionId?: string
  question: string
  fileUrl?: string
  code: string
  onChunk?: (chunk: string) => void
}) {
  return postForStream(
    '/assistant/helper/patent/stream',
    {
      session_id: sessionId,
      question: question,
      file_url: fileUrl,
      code
    },
    onChunk
  )
}
