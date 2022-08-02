export const getToken = (): string | null =>
  localStorage.getItem('access_token')

export const getRefreshToken = (): string | null =>
  localStorage.getItem('refresh_token')

export const removeTokens = (): void => {
  const info = localStorage.getItem('info_object')
  localStorage.clear()
  localStorage.setItem('info_object', info)
}

export const setItem = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value))
}

export const setMap = (key: string, map: Map<any, any>) => {
  localStorage.setItem(key, JSON.stringify(Array.from(map.entries())))
}

export const getItem = (key: string) => {
  return JSON.parse(localStorage.getItem(key))
}

export const getMap = (key: string) => {
  return new Map(JSON.parse(localStorage.getItem(key)))
}
