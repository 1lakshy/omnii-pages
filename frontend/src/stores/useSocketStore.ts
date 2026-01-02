import { create } from 'zustand'
import { User } from '@/types/user'
import { Room } from '@/types/room'

interface SocketStore {
  isConnected: boolean
  users: User[]
  identity: User | null
  room: Room | null
  roomId: string | undefined
  roomExists: boolean
  downloadCancelled: boolean
  checkedRoomCode: boolean
  
  setIsConnected: (connected: boolean) => void
  setUsers: (users: User[]) => void
  addUser: (user: User) => void
  removeUser: (userId: string) => void
  setIdentity: (identity: User) => void
  setRoom: (room: Room) => void
  setRoomId: (roomId: string | undefined) => void
  setRoomExists: (exists: boolean) => void
  setDownloadCancelled: (cancelled: boolean) => void
  setCheckedRoomCode: (checked: boolean) => void
  reset: () => void
}

export const useSocketStore = create<SocketStore>((set) => ({
  isConnected: false,
  users: [],
  identity: null,
  room: null,
  roomId: undefined,
  roomExists: false,
  downloadCancelled: false,
  checkedRoomCode: false,
  
  setIsConnected: (connected) => set({ isConnected: connected }),
  setUsers: (users) => set({ users }),
  addUser: (user) => set((state) => ({ users: [...state.users, user] })),
  removeUser: (userId) => set((state) => ({ 
    users: state.users.filter(u => u.id !== userId) 
  })),
  setIdentity: (identity) => set({ identity }),
  setRoom: (room) => set({ room }),
  setRoomId: (roomId) => set({ roomId }),
  setRoomExists: (exists) => set({ roomExists: exists }),
  setDownloadCancelled: (cancelled) => set({ downloadCancelled: cancelled }),
  setCheckedRoomCode: (checked) => set({ checkedRoomCode: checked }),
  reset: () => set({
    isConnected: false,
    users: [],
    roomId: undefined,
  }),
}))
