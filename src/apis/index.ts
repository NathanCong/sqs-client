import { postForStream, post } from '@/utils/request'

/**
 * 专利撰写（新版）
 */
export function helperPatentStream({
  sessionId,
  code,
  question,
  fileUrl,
  onChunk
}: {
  sessionId?: string
  code: string
  question: string
  fileUrl?: string
  onChunk?: (chunk: string) => void
}) {
  return postForStream(
    '/helper/patent/stream',
    { session_id: sessionId, code, question, file_url: fileUrl },
    onChunk
  )
}

/**
 * 技术交底书撰写（新版）
 */
export function helperDisclosureStream({
  sessionId,
  code,
  question,
  fileUrl,
  onChunk
}: {
  sessionId?: string
  code: string
  question: string
  fileUrl?: string
  onChunk?: (chunk: string) => void
}) {
  return postForStream(
    '/helper/disclosure/stream',
    { session_id: sessionId, code, question, file_url: fileUrl },
    onChunk
  )
}

/**
 * 咨询（新版）
 */
export function consultStream({
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
    '/consult/stream',
    { sessionId, question, file_url: fileUrl },
    onChunk
  )
}

/**
 * 检索策略生成
 */
export function searchStrategy(question: string) {
  return post('/search/strategy', { question })
}

/**
 * 专利检索
 */
export function searchPatents(params: unknown) {
  return post('/search/patents', params)
}

/**
 * 专利检索（通过检索式）
 */
export function searchPatentsFromStrategy(question: string) {
  return new Promise((resolve, reject) => {
    // 分析语义生成检索式
    searchStrategy(question)
      .then((res) => {
        // 利用检索式进行专利查询
        searchPatents(res)
          .then((res) => resolve(res))
          .catch((err) => reject(err))
      })
      .catch((err) => reject(err))
  })
}

/**
 * 读取文件
 */
export function readFile() {
  return post('/file/read')
}

/**
 * 写入文件
 */
export function writeFile() {
  return post('/file/generate', { jsonData: { a: 1, b: 2 } })
}

/**
 * 删除文件
 */
export function cleanFile() {
  return post('/file/clean')
}

/**
 * 上传文件
 */
export function uploadFile(savePath: string, file: File) {
  const formData = new FormData()
  formData.append('savePath', savePath)
  formData.append('file', file)
  return post('http://62.234.188.122:7003/resource/upload', formData, {
    'Content-Type': 'multipart/form-data'
  })
}
