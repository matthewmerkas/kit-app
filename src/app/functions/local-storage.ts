export const getToken = (): string | null =>
  localStorage.getItem('access_token')

export const removeTokens = (): void => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}
