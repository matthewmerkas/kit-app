export const getToken = (): string | null =>
  localStorage.getItem('access_token')

export const getRefreshToken = (): string | null =>
  localStorage.getItem('refresh_token')

export const removeTokens = (): void => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

export const setItem = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value))
}

export const getItem = (key: string) => {
  return JSON.parse(localStorage.getItem(key))
}
