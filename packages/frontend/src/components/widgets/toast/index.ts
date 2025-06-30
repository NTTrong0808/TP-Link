import { AxiosError } from 'axios'
import { ExternalToast, toast } from 'sonner'

const position = 'top-center'

export const toastSuccess = (message: string, options?: ExternalToast) => {
  return toast.success(message, {
    position,
    ...options,
  })
}

export const toastError = <E>(error: E | string, options?: ExternalToast) => {
  console.log('Error :', error)
  if (error instanceof AxiosError) {
    return toast.error(error.response?.data.message, {
      position,
      ...options,
    })
  }

  // if (error instanceof Error) {
  //   return toast.error(error.message, {
  //     position,
  //     ...options,
  //   })
  // }

  if (typeof error === 'string') {
    return toast.error(error, {
      position,
      ...options,
    })
  }

  return toast.error('Có lỗi xảy ra, vui lòng thử lại sau', {
    position,
    ...options,
  })
}
