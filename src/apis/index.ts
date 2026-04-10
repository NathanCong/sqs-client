import { postForStream, post } from '@/utils/request'
import type { AxiosResponse } from 'axios'

interface CommonResponse {
  code: number
  message: string
  success: boolean
}

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
    '/assistant/helper/disclosure/stream',
    {
      session_id: sessionId,
      code,
      question: question,
      file_url: fileUrl
    },
    onChunk
  )
}

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
    {
      session_id: sessionId,
      code,
      question: question || '帮我重写一下',
      file_url: fileUrl
    },
    onChunk
  )
}

interface UploadFileResponse extends CommonResponse {
  data: {
    createTime: string
    creator: string
    resourceHash: string
    resourceId: string
    resourceName: string
    resourceSize: number
    resourceType: string
    resourceUrl: string
  }
}

/**
 * 上传文件
 */
export function uploadFile(
  savePath: string,
  file: File
): Promise<AxiosResponse<UploadFileResponse>> {
  const formData = new FormData()
  formData.append('savePath', savePath)
  formData.append('file', file)
  return post('http://62.234.188.122:7003/resource/upload', formData, {
    'Content-Type': 'multipart/form-data'
  })
}

export interface RegisterParams {
  userName: string
  userPhone: string
  userEmail: string
  userPassword: string
}

export interface RegisterResponse extends CommonResponse {
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

export interface LoginResponse extends CommonResponse {
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

export interface PocParams {
  userEmail: string
  modelName: string
  questionType: string
  score: number
  originData: string
}

export interface PocResponse extends CommonResponse {
  data: null
}

/**
 * 用户评分
 */
export function poc(params: PocParams): Promise<AxiosResponse<PocResponse>> {
  return post('/poc', params)
}

/**
 * 专利检索
 */
export function searchPatents(params: unknown) {
  return post('/search/patents', params)
}

/**
 * 专利详情 - 说明书
 */
export function getPatentManual(params: { id: string }) {
  return post('/wanxiang/getPatentManual', params)
}
