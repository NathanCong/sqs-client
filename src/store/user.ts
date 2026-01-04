import { defineStore } from 'pinia'
import { setStorage, getStorage, delStorage } from '@/utils/storage'
import { decode } from 'js-base64'

export interface UserInfo {
  userEmail: string
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

  function getUserInfo(): UserInfo | null {
    let userInfo = null
    const accessToken = getAccessToken()
    if (!accessToken) {
      return userInfo
    }
    try {
      userInfo = JSON.parse(decode(accessToken))
    } catch (error) {
      console.warn('getUserInfo error', error)
    }
    return userInfo
  }

  /**
   * Exports
   */
  return {
    // actions
    setAccessToken,
    getAccessToken,
    delAccessToken,
    getUserInfo
  }
})
