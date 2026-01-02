import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ToastData } from '@/types/toast'

interface ToastStore {
  toasts: ToastData[]
  timers: Map<number, NodeJS.Timeout>
  addToast: (toast: Omit<ToastData, 'id' | 'duration'>, duration?: number) => void
  closeToast: (id: number) => void
  triggerTimeouts: () => void
}

export const useToastStore = create<ToastStore>()(
  persist(
    (set, get) => ({
      toasts: [],
      timers: new Map(),
      
      addToast: (toast, duration = 3000) => {
        const id = Date.now()
        const newToast: ToastData = {
          ...toast,
          id,
          duration,
        }
        
        set((state) => ({ toasts: [...state.toasts, newToast] }))
        
        const timer = setTimeout(() => {
          get().closeToast(id)
        }, duration)
        
        get().timers.set(id, timer)
      },
      
      closeToast: (id) => {
        const timers = get().timers
        const timer = timers.get(id)
        if (timer) {
          clearTimeout(timer)
          timers.delete(id)
        }
        set((state) => ({ 
          toasts: state.toasts.filter((toast) => toast.id !== id) 
        }))
      },
      
      triggerTimeouts: () => {
        const { toasts, timers, closeToast } = get()
        toasts.forEach((toast) => {
          if (!timers.has(toast.id)) {
            const timer = setTimeout(() => {
              closeToast(toast.id)
            }, toast.duration || 3000)
            timers.set(toast.id, timer)
          }
        })
      },
    }),
    {
      name: 'toasts',
      partialize: (state) => ({ toasts: state.toasts }),
    }
  )
)
