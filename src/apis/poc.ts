import { post } from '@/utils/request'
import type { AxiosResponse } from 'axios'
import type { CommonResponse } from './common'

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
 * 用户评分
 */
export function poc(params: PocParams): Promise<AxiosResponse<PocResponse>> {
  return post('/poc', params)
}
