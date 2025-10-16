import axios from 'axios'
import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosError,
  AxiosResponse
} from 'axios'
import { notification } from 'ant-design-vue'

/**
 * 创建axios实例
 */
const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

/**
 * 请求拦截器
 */
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error: AxiosError) => {
    notification.error({ message: '网络请求错误', description: error.message })
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 */
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data, message, success } = response.data
    if (success) {
      return data
    }
    const error = new Error(message)
    notification.error({ message: '服务响应异常', description: error.message })
    return Promise.reject(error)
  },
  (error: AxiosError) => {
    let errorMessage = ''
    // 处理不同类型的错误
    if (error.response) {
      // 服务器返回了错误状态码
      const { status } = error.response
      switch (status) {
        case 400:
          errorMessage = '客户端请求错误'
          break
        case 401:
          errorMessage = '未授权，需要身份验证'
          break
        case 403:
          errorMessage = '禁止访问，服务器拒绝请求'
          break
        case 404:
          errorMessage = '请求的资源不存在'
          break
        case 500:
          errorMessage = '服务器内部错误'
          break
        case 502:
          errorMessage = '网关错误'
          break
        case 503:
          errorMessage = '服务不可用'
          break
        default:
          errorMessage = `异常状态码 ${status}`
          break
      }
    } else if (error.request) {
      // 请求已经发送，但没有收到响应
      errorMessage = '网络连接异常或服务器无响应'
    } else {
      // 其他未知错误
      errorMessage = error.message || '未知错误'
    }
    notification.error({ message: '服务响应异常', description: errorMessage })
    return Promise.reject(error)
  }
)

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
) {
  return new Promise((resolve, reject) => {
    request
      .post(url, data, {
        responseType: 'text', // 使用 text 格式接收数据
        onDownloadProgress: (progressEvent) => {
          console.log('progressEvent', progressEvent)
          if (onChunk) {
            // 处理接收到的数据块
            // const responseText = progressEvent.currentTarget.responseText || ''
            onChunk('')
          }
        }
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err))
  })
}
