import { toast, type ToastOptions } from 'react-toastify'

export const notify = {
  success: (message: string, options?: ToastOptions) =>
    toast.success(message, options),
  error: (message: string, options?: ToastOptions) =>
    toast.error(message, options),
  warning: (message: string, options?: ToastOptions) =>
    toast.warn(message, options),
  info: (message: string, options?: ToastOptions) =>
    toast.info(message, options)
}

export default notify
