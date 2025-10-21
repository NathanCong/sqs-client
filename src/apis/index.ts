import { postForStream, post } from '@/utils/request'

/**
 * 提问接口
 */
export function consultStream(
  question: string,
  onChunk?: (chunk: string) => void
) {
  return postForStream('/consult/stream', { question }, onChunk)
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
