import { apiConfig } from './api.config'

export const environment = {
  production: true,
  apiUrl: 'https://mattopia.servegame.com/kit/api',
  socketUri: 'https://mattopia.servegame.com',
  socketPath: '/kit/socket.io/',
  apiConfig,
}
