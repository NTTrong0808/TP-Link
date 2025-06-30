import axios, { AxiosInstance } from 'axios'

export interface IResponse<T> {
  status: string
  data: T
  error?: any
}

export interface IMedia {
  _id: string
  filename: string
  preview: string
  previewURL: string
  fileKey: string
}

export class UploadService {
  private axiosInstance: AxiosInstance

  public static API_PATHS = {
    UPLOAD: '/partner-upload',
    GET_MEDIA: '/get-media/:id',
  }

  private config = {
    publicUrl: process.env.NEXT_PUBLIC_DW_API_URL + '/api/v1',
  }

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.config.publicUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  async uploadFilesForPartner(files: File[], deletedIds?: string[]) {
    try {
      const formData = new FormData()
      formData.append('partnerId', 'langfarm-ticket')
      files.forEach((file) => formData.append('files', file))
      if (deletedIds) deletedIds.forEach((deletedId) => formData.append('deletedIds', deletedId))

      const response = await this.axiosInstance.post<
        IResponse<{
          message: string
          mediaIds: string[]
        }>
      >(UploadService.API_PATHS.UPLOAD, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      return response.data
    } catch (error) {
      console.error('File upload failed:', error)
      throw error
    }
  }

  async getUploadFile(mediaId: string) {
    try {
      const response = await this.axiosInstance.get<IResponse<IMedia>>(
        UploadService.API_PATHS.GET_MEDIA.replace(':id', mediaId),
      )

      return response.data
    } catch (error) {
      console.error('File upload failed:', error)
      throw error
    }
  }
}

export const uploadService = new UploadService()
