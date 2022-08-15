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
  user: User
  peer: User
  direction: 'send' | 'receive'
  audioFileName: string
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

export interface Tag {
  _id?: string
  tagId: string
  user?: User
}
