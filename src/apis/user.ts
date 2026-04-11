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

export interface AddUserExpressionParams {
  userEmail: string
  expressionType: number
  expressionText: string
  resultData: string
}

export interface AddUserExpressionResponse extends CommonResponse {
  data: null
}

/**
 * 用户 - 新增检索式
 */
export function addUserExpression(
  params: AddUserExpressionParams
): Promise<AxiosResponse<AddUserExpressionResponse>> {
  return post('/user/expression/add', params)
}

export interface GetUserExpressionListParams {
  userEmail: string
  expressionType?: number
  sTime?: string
  eTime?: string
}

export interface GetUserExpressionListResponse extends CommonResponse {
  data: {
    id: number
    expressionType: number
    expressionText: string
    resultData: string
    creator: string
    createdAt: string
    updater: string
    updatedAt: string
  }[]
}

/**
 * 用户 - 获取检索式列表
 */
export function getUserExpressionList(
  params: GetUserExpressionListParams
): Promise<AxiosResponse<GetUserExpressionListResponse>> {
  return get('/user/expression/list', params)
}

export interface UpdateUserExpressionParams {
  expressionId: number
  expressionText: string
  resultData: string
}

export interface UpdateUserExpressionResponse extends CommonResponse {
  data: null
}

/**
 * 用户 - 更新检索式
 */
export function updateUserExpression(
  params: UpdateUserExpressionParams
): Promise<AxiosResponse<UpdateUserExpressionResponse>> {
  return post('/user/expression/update', params)
}

export interface DeleteUserExpressionParams {
  expressionId: number
}

export interface DeleteUserExpressionResponse extends CommonResponse {
  data: null
}

/**
 * 用户 - 删除检索式
 */
export function deleteUserExpression(
  params: DeleteUserExpressionParams
): Promise<AxiosResponse<DeleteUserExpressionResponse>> {
  return post('/user/expression/delete', params)
}
