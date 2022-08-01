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

export interface Message {
  _id: string
  userId: string
  user: User
  peerId: string
  direction: 'send' | 'receive'
  audioUrl: string
  currentTime: number
  duration: number
  text: string
  createdAt: string
  updatedAt: string
  isDeleted: boolean
}

export interface SoftDeletes {
  isDeleted?: boolean
}

export interface User extends SoftDeletes {
  _id?: string
  username?: string
  displayName?: string
}
