import { apiConfig } from './api.config'

export const environment = {
  production: true,
  apiUrl: 'https://mattopia.servegame.com/kit/api',
  socketUri: 'http://mattopia1.servegame.com',
  socketPath: '/kit/socket.io/',
  apiConfig,
}
