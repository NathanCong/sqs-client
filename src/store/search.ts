import { defineStore } from 'pinia'
import {
  addUserExpression,
  getUserExpressionList,
  updateUserExpression,
  deleteUserExpression
} from '@/apis'
import type {
  AddUserExpressionParams,
  GetUserExpressionListParams,
  UpdateUserExpressionParams,
  DeleteUserExpressionParams
} from '@/apis'
import { notification } from 'ant-design-vue'

export const useSearchStore = defineStore('search', {
  state: () => ({}),
  actions: {
    async addExpression(params: AddUserExpressionParams) {
      try {
        const { data: response } = await addUserExpression(params)
        const { success, message: description } = response
        if (!success) {
          notification.error({ message: '新增表达式失败', description })
          return
        }
      } catch (error) {
        console.warn(error)
      }
    },
    async getExpressionList(
      params: GetUserExpressionListParams
    ): Promise<unknown[]> {
      let result: unknown[] = []
      try {
        const { data: response } = await getUserExpressionList(params)
        const { success, message: description, data } = response
        if (!success) {
          notification.error({ message: '获取表达式列表失败', description })
        } else {
          result = data
        }
      } catch (error) {
        console.warn(error)
      } finally {
        return result
      }
    },
    async updateExpression(params: UpdateUserExpressionParams) {
      try {
        const { data: response } = await updateUserExpression(params)
        const { success, message: description } = response
        if (!success) {
          notification.error({ message: '更新表达式失败', description })
          return
        }
        notification.success({ message: '更新表达式成功' })
      } catch (error) {
        console.warn(error)
      }
    },
    async deleteExpression(params: DeleteUserExpressionParams) {
      try {
        const { data: response } = await deleteUserExpression(params)
        const { success, message: description } = response
        if (!success) {
          notification.error({ message: '删除表达式失败', description })
          return
        }
        notification.success({ message: '删除表达式成功' })
      } catch (error) {
        console.warn(error)
      }
    }
  }
})
