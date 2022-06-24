import { ValidationErrorItem } from 'joi'

export interface IError {
  error: string
  errorDetails?: ValidationErrorItem[]
}

export interface ISuccess<T> {
  data: T
}

export type IResponse<T> = IError | ISuccess<T>

export interface IServerEvents {
  'message:repass': (message: string) => void
  'message:success': (message: any) => void
  
}

export interface IClientEvents {
  'message:send': (message: string, callback:any) => void
  'message:success': (message: string) => void
}
