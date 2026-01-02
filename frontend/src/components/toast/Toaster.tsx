import { useEffect } from 'react'
import { useToastStore } from '@/stores/useToastStore'
import { ToastType } from '@/types/toast'
import CheckmarkIcon from './CheckmarkIcon'
import ErrorIcon from './ErrorIcon'

export default function Toaster() {
  const { toasts, triggerTimeouts } = useToastStore()

  useEffect(() => {
    triggerTimeouts()
  }, [triggerTimeouts])

  return (
    <div className="toast toast-top toast-center sm:toast-end z-50 w-full sm:w-auto">
      {toasts.map((toast) => (
        <div key={toast.id} className="card card-compact card-bordered bg-base-100 shadow-xl w-full sm:w-96 transition-popup">
          <div className="card-body flex flex-row">
            <div className="my-auto px-2">
              {toast.type === ToastType.Success && <CheckmarkIcon />}
              {toast.type === ToastType.Error && <ErrorIcon />}
            </div>
            <div>
              <div>
                <h3 className="font-bold text-lg">
                  {toast.title}
                </h3>
                <div>
                  {toast.description}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
