// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { apiConfig } from './api.config'

export const environment = {
  production: false,
  apiUrl: 'https://mattopia.servegame.com/kit/api',
  socketUri: 'http://mattopia1.servegame.com',
  socketPath: '/kit/socket.io/',
  apiConfig,
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
