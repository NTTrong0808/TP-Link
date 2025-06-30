// src/lib/api/-action-log/useCreateActionLog.ts

import { AxiosError } from 'axios'
import { createMutation } from 'react-query-kit'
import { ICreateActionLogDto } from './types'
import { consumerApi } from '../..'

export const LogService = {
  async createActionLog(dto: ICreateActionLogDto) {
    const res = await consumerApi.post('/action-logs', dto)
    return res.data
  },
}

export interface Variables {
  dto: ICreateActionLogDto
}

export interface Response extends Awaited<ReturnType<typeof LogService.createActionLog>> {}

export interface Error extends AxiosError<Response> {}

export const useCreateActionLogs = createMutation<Response, Variables, any>({
  mutationFn: (variables) => LogService.createActionLog(variables.dto),
})
