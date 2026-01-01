import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getStorage } from '@/utils/storage'
import { decode } from 'js-base64'

export const useUserStore = defineStore('user', () => {
  /**
   * State
   */
  const accessToken = ref<string>(getStorage('accessToken'))

  /**
   * Getters
   */
  const userEmail = computed(() => {
    if (!accessToken.value) {
      return ''
    }
    const data = JSON.parse(decode(accessToken.value))
    return data.userEmail
  })

  /**
   * Exports
   */
  return {
    // state
    accessToken,
    // getters
    userEmail
  }
})
