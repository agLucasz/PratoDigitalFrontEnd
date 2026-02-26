import { toast, type ToastOptions } from 'react-toastify'

let activeToasts = 0

function addDim() {
  activeToasts += 1
  if (typeof document !== 'undefined') {
    document.body.classList.add('toast-dim')
  }
}

function removeDim() {
  activeToasts = Math.max(0, activeToasts - 1)
  if (activeToasts === 0 && typeof document !== 'undefined') {
    document.body.classList.remove('toast-dim')
  }
}

function withDim(options?: ToastOptions): ToastOptions {
  return {
    ...options,
    onOpen: () => {
      addDim()
      options?.onOpen?.()
    },
    onClose: () => {
      removeDim()
      options?.onClose?.()
    }
  }
}

export const notify = {
  success: (message: string, options?: ToastOptions) =>
    toast.success(message, withDim(options)),
  error: (message: string, options?: ToastOptions) =>
    toast.error(message, withDim(options)),
  warning: (message: string, options?: ToastOptions) =>
    toast.warn(message, withDim(options)),
  info: (message: string, options?: ToastOptions) =>
    toast.info(message, withDim(options))
}

export default notify
