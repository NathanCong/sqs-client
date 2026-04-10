import { get, post } from '@/utils/request'
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

interface GetUserInfoResponse extends CommonResponse {
  data: {
    userEmail: string
    userName: string
    userPhone: string
    userPassword: string
  }
}

/**
 * 用户 - 获取个人信息
 */
export function getUserInfo(
  userEmail: string
): Promise<AxiosResponse<GetUserInfoResponse>> {
  return get('/user/info/get', { userEmail })
}

interface UpdateUserInfoParams {
  userEmail: string
  userName: string
  userPhone: string
  userPassword: string
}

interface UpdateUserInfoResponse extends CommonResponse {
  data: null
}

/**
 * 用户 - 更新个人信息
 */
export function updateUserInfo(
  params: UpdateUserInfoParams
): Promise<AxiosResponse<UpdateUserInfoResponse>> {
  return post('/user/info/update', params)
}
