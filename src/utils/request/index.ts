import axios from 'axios'
import type { AxiosInstance } from 'axios'
import {
  handleRequestSuccess,
  handleRequestFailure,
  handleResponseSuccess,
  handleResponseFailure
} from './utils'

/**
 * 创建axios实例
 */
const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

/**
 * 请求拦截器
 */
request.interceptors.request.use(handleRequestSuccess, handleRequestFailure)

/**
 * 响应拦截器
 */
request.interceptors.response.use(handleResponseSuccess, handleResponseFailure)

/**
 * GET 请求
 */
export function get(url: string, params?: unknown) {
  return request.get(url, { params })
}

/**
 * POST 请求（默认 JSON）
 */
export function post(url: string, data?: unknown) {
  return request.post(url, data)
}

/**
 * POST 请求（处理流式响应）
 */
export function postForStream(
  url: string,
  data?: unknown,
  onChunk?: (chunk: string) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    request
      .post(url, data, {
        responseType: 'text',
        onDownloadProgress: (progressEvent) => {
          const dataLines = progressEvent.event.target.responseText.split('\n')
          const contents: string[] = []
          dataLines.forEach((dataLine: string) => {
            const dataString = dataLine.replace('data: ', '').trim()
            // 结束标志
            if (dataString === '[DONE]') {
              resolve()
              return
            }
            // 校验 JSON 字符串
            if (dataString.startsWith('{') && dataString.endsWith('}')) {
              try {
                const data = JSON.parse(dataString)
                const { content } = data.choices[0].delta
                if (content) {
                  contents.push(content)
                }
              } catch (err) {
                console.error(err)
              }
            }
          })
          // 响应数据
          if (onChunk) {
            onChunk(contents.join(''))
          }
        }
      })
      .then(() => {
        resolve()
      })
      .catch((err) => reject(err))
  })
}
