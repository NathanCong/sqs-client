import { defineStore } from 'pinia'
import { setStorage, getStorage } from '@/utils/storage'
import dayjs from 'dayjs'

export const useSearchStore = defineStore('search', {
  state: () => ({}),
  getters: {
    searchHistory: () => JSON.parse(getStorage('searchHistory') || '[]')
  },
  actions: {
    addSearchHistory(user: string, q: string) {
      const searchHistory = JSON.parse(getStorage('searchHistory') || '[]')
      if (searchHistory) {
        ;(searchHistory as any[]).push({
          user,
          q,
          createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
        })
        setStorage('searchHistory', JSON.stringify(searchHistory))
      } else {
        setStorage(
          'searchHistory',
          JSON.stringify([
            {
              user,
              q,
              createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
            }
          ])
        )
      }
    }
  }
})
