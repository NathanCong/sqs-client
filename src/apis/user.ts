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
 * 用户 - 注册
 */
export function register(
  params: RegisterParams
): Promise<AxiosResponse<RegisterResponse>> {
  return post('/user/register', params)
}

export interface LoginParams {
  userEmail: string
  userPassword: string
}

interface LoginResponse extends CommonResponse {
  data: { accessToken: string }
}

/**
 * 用户 - 登录
 */
export function login(
  params: LoginParams
): Promise<AxiosResponse<LoginResponse>> {
  return post('/user/login', params)
}

interface PocParams {
  userEmail: string
  modelName: string
  questionType: string
  score: number
  originData: string
}

interface PocResponse extends CommonResponse {
  data: null
}

/**
 * 用户 - 评分
 */
export function poc(params: PocParams): Promise<AxiosResponse<PocResponse>> {
  return post('/user/poc', params)
}
