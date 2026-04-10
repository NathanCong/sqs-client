import { post } from '@/utils/request'

/**
 * 专利检索
 */
export function searchPatents(params: unknown) {
  return post('/wanxiang/search/patents', params)
}

/**
 * 专利详情 - 说明书
 */
export function getPatentManual(params: { id: string }) {
  return post('/wanxiang/getPatentManual', params)
}
