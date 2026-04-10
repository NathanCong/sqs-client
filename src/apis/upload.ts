import { post } from '@/utils/request'
import type { CommonResponse } from './common'
import type { AxiosResponse } from 'axios'

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
