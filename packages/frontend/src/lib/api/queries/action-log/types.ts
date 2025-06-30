// src/lib/api/employee-action-log/types.ts

export interface ActionLogItem {
  action: string
  metadata: Record<string, any>
  timestamp: string // ISO string
}

export interface ICreateActionLogDto {
  sessionId: string
  userId: string
  userName?: string
  page: string
  actions: ActionLogItem[]
}
