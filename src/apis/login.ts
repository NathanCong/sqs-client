import { post } from '@/utils/request'
import type { AxiosResponse } from 'axios'
import type { CommonResponse } from './common'

interface RegisterParams {
  userName: string
  userPhone: string
  userEmail: string
  userPassword: string
}

interface RegisterResponse extends CommonResponse {
  data: null
}

/**
 * 新用户注册
 */
export function register(
  params: RegisterParams
): Promise<AxiosResponse<RegisterResponse>> {
  return post('/register', params)
}

export interface LoginParams {
  userEmail: string
  userPassword: string
}

interface LoginResponse extends CommonResponse {
  data: { accessToken: string }
}

/**
 * 老用户登录
 */
export function login(
  params: LoginParams
): Promise<AxiosResponse<LoginResponse>> {
  return post('/login', params)
}
