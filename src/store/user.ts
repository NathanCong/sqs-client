import { defineStore } from 'pinia'
import { setStorage, getStorage, delStorage } from '@/utils/storage'
import { decode } from 'js-base64'
import { getUserInfo as getUserInfoApi, updateUserInfo } from '@/apis/user'
import { notification } from 'ant-design-vue'

export interface UserInfo {
  userEmail: string
  userName: string
  userPhone: string
  userPassword: string
}

/**
 * User Store（用户信息数据）
 */
export const useUserStore = defineStore('user', () => {
  /**
   * Actions
   */
  function setAccessToken(accessToken: string): void {
    setStorage('accessToken', accessToken)
  }

  function getAccessToken(): string {
    return getStorage('accessToken')
  }

  function delAccessToken(): void {
    delStorage('accessToken')
  }

  async function getUserInfo(): Promise<UserInfo | null> {
    let userInfo = null
    const accessToken = getAccessToken()
    if (!accessToken) {
      return userInfo
    }
    try {
      const { userEmail } = JSON.parse(decode(accessToken))
      const { data } = await getUserInfoApi(userEmail)
      const { success, message: description, data: response } = data
      if (!success) {
        notification.error({ message: '获取个人信息失败', description })
        return userInfo
      }
      userInfo = response
    } catch (error) {
      console.warn('getUserInfo error', error)
    }
    return userInfo
  }

  async function setUserInfo(userInfo: UserInfo): Promise<void> {
    try {
      const { data } = await updateUserInfo(userInfo)
      const { success, message: description } = data
      if (!success) {
        notification.error({ message: '更新个人信息失败', description })
        return
      }
      notification.success({ message: '更新个人信息成功' })
    } catch (error) {
      console.warn('setUserInfo error', error)
    }
  }

  /**
   * Exports
   */
  return {
    // actions
    setAccessToken,
    getAccessToken,
    delAccessToken,
    getUserInfo,
    setUserInfo
  }
})
