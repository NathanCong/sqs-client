import { post, get } from '@/utils/request'

/**
 * 专利检索
 */
export function searchPatents(params: unknown) {
  return post('/wanxiang/patent/search', params)
}

/**
 * 专利详情 - 基本信息
 */
export function getPatentBasicInfo(params: { id: string }) {
  return get('/wanxiang/patent/detail/basicinfo', params)
}

/**
 * 专利详情 - 说明书
 */
export function getPatentDesc(params: { id: string }) {
  return get('/wanxiang/patent/detail/desc', params)
}

/**
 * 专利详情 - 权利要求
 */
export function getPatentClaims(params: { id: string }) {
  return get('/wanxiang/patent/detail/claim', params)
}
