import { Injectable } from '@nestjs/common'
import { request } from 'undici'

@Injectable()
export class UndiciHttpService {
  async get<T = unknown>(url: string, headers: Record<string, string> = {}): Promise<T> {
    try {
      const { body } = await request(url, { method: 'GET', headers })
      return <Promise<T>>body.json()
    } catch (error) {
      throw new Error(`GET request failed: ${error.message}`)
    }
  }

  async post<T = unknown>(url: string, data: any, headers: Record<string, string> = {}): Promise<T> {
    try {
      const { body } = await request<T>(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(data),
      })
      return <Promise<T>>body.json()
    } catch (error) {
      throw new Error(`POST request failed: ${error.message}`)
    }
  }
}
