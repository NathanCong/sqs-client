/**
 * 检查当前环境是否支持 localStorage 功能
 */
function isLocalStorageSupported(): boolean {
  if (typeof window === 'undefined' || !window.localStorage) {
    console.warn('当前环境不支持 localStorage 功能！')
    return false
  }
  return true
}

/**
 * 存储数据
 */
export function setStorage(key: string, value: string): void {
  if (!isLocalStorageSupported()) {
    return
  }
  window.localStorage.setItem(key, value)
}

/**
 * 获取存储的数据
 */
export function getStorage(key: string): string {
  if (!isLocalStorageSupported()) {
    return ''
  }
  return window.localStorage.getItem(key) || ''
}

/**
 * 删除存储的数据
 */
export function delStorage(key: string): void {
  if (!isLocalStorageSupported()) {
    return
  }
  window.localStorage.removeItem(key)
}
