import type {
  InternalAxiosRequestConfig,
  AxiosError,
  AxiosResponse
} from 'axios'
import { notification } from 'ant-design-vue'

export function handleRequestSuccess(config: InternalAxiosRequestConfig) {
  return config
}

export function handleRequestFailure(error: AxiosError) {
  notification.error({ message: '网络请求错误', description: error.message })
  return Promise.reject(error)
}

export function handleResponseSuccess(response: AxiosResponse) {
  return response
}

export function handleResponseFailure(error: AxiosError) {
  return Promise.reject(error)
}
