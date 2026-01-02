import { useRef, useCallback } from 'react'
import { useSocketStore } from '@/stores/useSocketStore'
import { useWebRTC } from './useWebRTC'

export function useWebSocket() {
  const socketRef = useRef<WebSocket | null>(null)
  const reconnectAttemptRef = useRef<number>(0)
  const maxReconnectAttempts = 5
  const identityRef = useRef<any>(null) // Store identity to avoid stale closure
  const roomIdRef = useRef<string | undefined>(undefined) // Store roomId to avoid timing issues
  const {
    setIsConnected,
    setUsers,
    addUser,
    removeUser,
    setIdentity,
    setRoom,
    setRoomId,
    setRoomExists,
    setDownloadCancelled,
    setCheckedRoomCode,
    roomId,
    identity,
    users,
    reset
  } = useSocketStore()

  const {
    createRtcOffer,
    handleRtcOffer,
    handleRtcAnswer,
    handleIceCandidate,
    closeWebRtcConnection,
    closeAllWebRtcConnections,
    updateRoomRef,
    updateIdentityRef,
    updateFilesUploadedRef
  } = useWebRTC()

  const sendMessage = useCallback((type: string, payload?: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type, payload }))
    }
  }, [])

  const sendRequestRoom = useCallback(() => {
    sendMessage("REQUEST_ROOM")
  }, [sendMessage])

  const sendRoomExists = useCallback((roomId: string) => {
    sendMessage("ROOM_EXISTS", { roomId })
  }, [sendMessage])

  const sendJoinRoom = useCallback((roomId: string) => {
    sendMessage("JOIN_ROOM", { roomId })
  }, [sendMessage])

  const sendCancelDownload = useCallback(() => {
    sendMessage("CANCEL_DOWNLOAD", { roomId })
  }, [sendMessage, roomId])

  const sendWebRtcMessage = useCallback((type: string, payload: any) => {
    sendMessage(type, payload)
  }, [sendMessage])

  const handleMessages = useCallback(async (data: any) => {
    console.log("message type:", data.type, "data:", data)

    switch (data.type) {
      case "IDENTITY": {
        console.log("Setting identity:", data.user)
        identityRef.current = data.user // Store in ref immediately
        setIdentity(data.user)
        updateIdentityRef(data.user) // Update WebRTC ref synchronously
        const id = roomIdRef.current || roomId
        console.log("IDENTITY handler - checking roomId:", { fromRef: roomIdRef.current, fromStore: roomId, using: id })
        if (id !== undefined) {
          sendRoomExists(id)
          break
        }
        sendRequestRoom()
        break
      }
      case "ROOM_CREATED": {
        console.log("ROOM_CREATED - setting room:", data.room.id)
        setRoom(data.room)
        updateRoomRef(data.room) // Update WebRTC ref synchronously
        setRoomId(data.room.id)
        setIsConnected(true)
        setUsers([])
        break
      }
      case "ROOM_EXISTS": {
        const exists = data.exists
        setRoomExists(exists)
        if (!exists) {
          setCheckedRoomCode(true)
          break
        }
        setRoomId(data.roomId)
        sendJoinRoom(data.roomId)
        break
      }
      case "ROOM_JOINED": {
        const myIdentity = identityRef.current || identity
        console.log("ROOM_JOINED - users in room:", data.users, "my identity:", myIdentity?.id)
        console.log("ROOM_JOINED - setting room:", data.room.id)
        setDownloadCancelled(false)
        setCheckedRoomCode(true)
        setRoom(data.room)
        updateRoomRef(data.room) // Update WebRTC ref synchronously BEFORE processing users
        setIsConnected(true)
        for (const user of data.users) {
          if (user.id === myIdentity?.id) {
            console.log("Skipping self user:", user.id)
            continue
          }
          console.log("Adding user from room:", user.id)
          addUser(user)
        }
        break
      }
      case "USER_JOINED": {
        console.log("USER_JOINED event received:", data.user, "Current users:", users)
        if (!users.find(user => user.id === data.user.id)) {
          console.log("Creating RTC offer to new user:", data.user.id)
          addUser(data.user)
          await createRtcOffer(socketRef.current, data.user.id)
        } else {
          console.log("User already exists, skipping RTC offer")
        }
        break
      }
      case "USER_LEFT": {
        console.log("USER_LEFT event:", data.user.id)
        removeUser(data.user.id)
        await closeWebRtcConnection(data.user.id)
        // Don't close the WebSocket just because another user left
        break
      }
      case "OFFER": {
        await handleRtcOffer(socketRef.current, data)
        break
      }
      case "ANSWER": {
        await handleRtcAnswer(data)
        break
      }
      case "ICE_CANDIDATE": {
        await handleIceCandidate(data)
        break
      }
      case "CANCEL_DOWNLOAD": {
        console.log("Download cancelled")
        setDownloadCancelled(true)
        break
      }
    }
  }, [
    roomId,
    identity,
    users,
    setIdentity,
    setRoom,
    setRoomId,
    setIsConnected,
    setUsers,
    setRoomExists,
    setCheckedRoomCode,
    setDownloadCancelled,
    addUser,
    removeUser,
    sendRoomExists,
    sendRequestRoom,
    sendJoinRoom,
    createRtcOffer,
    handleRtcOffer,
    handleRtcAnswer,
    handleIceCandidate,
    closeWebRtcConnection,
    updateRoomRef,
    updateIdentityRef
  ])

  const connect = useCallback(() => {
    console.log("connect() called, roomIdRef.current:", roomIdRef.current, "roomId from store:", roomId)
    // Prevent creating duplicate connections
    if (socketRef.current && (socketRef.current.readyState === WebSocket.CONNECTING || socketRef.current.readyState === WebSocket.OPEN)) {
      console.log("WebSocket already connected or connecting, skipping...")
      return
    }

    const wsProtocol = import.meta.env.PUBLIC_WS_PROTOCOL || 'ws'
    const wsHost = import.meta.env.PUBLIC_WS_HOST || 'localhost:7331'
    const url = `${wsProtocol}://${wsHost}/api/websocket`

    console.log("Creating new WebSocket connection to:", url)
    socketRef.current = new WebSocket(url)

    socketRef.current.onopen = () => {
      console.log("Connected to websocket server")
      reconnectAttemptRef.current = 0 // Reset reconnect attempts on successful connection
      setIsConnected(true)
    }

    socketRef.current.onclose = (event) => {
      console.log("Disconnected from websocket server", { code: event.code, reason: event.reason, wasClean: event.wasClean })
      setIsConnected(false)
      closeAllWebRtcConnections()

      // Only reconnect if it was an unexpected closure (not clean close)
      // Code 1000 = normal closure, 1001 = going away, 1006 = abnormal
      if (roomId !== undefined && !event.wasClean && event.code === 1006 && reconnectAttemptRef.current < maxReconnectAttempts) {
        reconnectAttemptRef.current += 1
        console.log(`Reconnecting... attempt ${reconnectAttemptRef.current} of ${maxReconnectAttempts}`)
        setTimeout(() => {
          connect()
        }, 2000) // Fixed 2 second delay
      } else if (reconnectAttemptRef.current >= maxReconnectAttempts) {
        console.error("Max reconnection attempts reached. Please refresh the page.")
      } else if (event.wasClean || event.code !== 1006) {
        console.log("WebSocket closed cleanly, not reconnecting")
      }
    }

    socketRef.current.onerror = (error) => {
      console.error("Websocket error", error)
    }

    socketRef.current.onmessage = async (event) => {
      const data = JSON.parse(event.data)
      await handleMessages(data)
    }
  }, [setIsConnected, closeAllWebRtcConnections, roomId, handleMessages])

  const disconnect = useCallback(() => {
    console.log("disconnect() called")
    if (socketRef.current) {
      socketRef.current.close()
    }
    reset()
    socketRef.current = null
    // Don't clear roomIdRef here - it might be needed if component remounts
  }, [reset])

  const setRoomIdToJoin = useCallback((id: string | undefined) => {
    console.log("setRoomIdToJoin called with:", id)
    roomIdRef.current = id
    setRoomId(id)
  }, [setRoomId])

  return {
    socket: socketRef.current,
    connect,
    disconnect,
    sendCancelDownload,
    sendWebRtcMessage,
    setRoomIdToJoin,
    updateFilesUploadedRef,
  }
}
