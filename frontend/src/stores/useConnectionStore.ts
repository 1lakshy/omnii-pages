import { create } from 'zustand'
import { Connection } from '@/types/connection'

interface ConnectionStore {
  connections: Map<string, Connection>
  setConnection: (target: string, connection: Connection) => void
  getConnection: (target: string) => Connection | undefined
  deleteConnection: (target: string) => void
  clearConnections: () => void
}

export const useConnectionStore = create<ConnectionStore>((set, get) => ({
  connections: new Map(),
  
  setConnection: (target, connection) => {
    set((state) => {
      const newConnections = new Map(state.connections)
      newConnections.set(target, connection)
      return { connections: newConnections }
    })
  },
  
  getConnection: (target) => {
    return get().connections.get(target)
  },
  
  deleteConnection: (target) => {
    set((state) => {
      const newConnections = new Map(state.connections)
      newConnections.delete(target)
      return { connections: newConnections }
    })
  },
  
  clearConnections: () => {
    get().connections.forEach((connection) => {
      connection.peerConnection.close()
      connection.dataChannel?.close()
    })
    set({ connections: new Map() })
  },
}))
