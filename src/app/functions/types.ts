import { HttpErrorResponse } from '@angular/common/http'

export interface Info {
  name: string
}

export interface Jwt {
  token: string
  refreshToken: string
}

export interface JwtErrorResponse extends HttpErrorResponse {
  code: string
}

export interface Login {
  username: string
  password: string
}

export interface Password {
  username: string
  displayName: string
  password: string
}

export interface SoftDeletes {
  isDeleted?: boolean
}

export interface User extends SoftDeletes {
  _id?: string
  username?: string
  displayName?: string
}
