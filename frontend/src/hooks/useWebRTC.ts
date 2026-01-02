// import { useCallback, useRef, useEffect } from 'react'
// import { useConnectionStore } from '@/stores/useConnectionStore'
// import { useSocketStore } from '@/stores/useSocketStore'
// import { useFileStore } from '@/stores/useFileStore'
// import { useToastStore } from '@/stores/useToastStore'
// import { Connection } from '@/types/connection'
// import { FileOfferType, FileOffer } from '@/types/file'
// import { ToastType } from '@/types/toast'
// import StreamSaver from 'streamsaver'
// import { v4 as uuidv4 } from 'uuid'

// StreamSaver.mitm = `/StreamSaver/mitm.html?version=2.0.6`

// let stream: WritableStream<Uint8Array> | null = null
// let writer: WritableStreamDefaultWriter<Uint8Array> | null = null
// let accSize = 0

// export function useWebRTC() {
//   const { setConnection, getConnection, deleteConnection, clearConnections, connections } = useConnectionStore()
//   const { identity, room } = useSocketStore()
//   const roomRef = useRef<any>(null)
//   const identityRef = useRef<any>(null)
//   const filesUploadedRef = useRef<FileList | null>(null)
  

//   // Keep refs in sync with store values
//   useEffect(() => {
//     if (room) {
//       console.log("useWebRTC: Updating roomRef with room:", room.id)
//       roomRef.current = room
//     }
//   }, [room])

//   useEffect(() => {
//     if (identity) {
//       console.log("useWebRTC: Updating identityRef with identity:", identity.id)
//       identityRef.current = identity
//     }
//   }, [identity])

//   // Expose method to update refs directly for immediate synchronous updates
//   const updateRoomRef = useCallback((newRoom: any) => {
//     console.log("useWebRTC: updateRoomRef called with room:", newRoom?.id)
//     roomRef.current = newRoom
//   }, [])

//   const updateIdentityRef = useCallback((newIdentity: any) => {
//     console.log("useWebRTC: updateIdentityRef called with identity:", newIdentity?.id)
//     identityRef.current = newIdentity
//   }, [])

//   const updateFilesUploadedRef = useCallback((files: FileList | null) => {
//     console.log("useWebRTC: updateFilesUploadedRef called with files:", files?.length || 0, "files")
//     filesUploadedRef.current = files
//   }, [])

//   const {
//     filesUploaded,
//     addIncomingFileOffer,
//     currentFileOffer,
//     setCurrentFileOffer,
//     updateCurrentFileOffer,
//     nextFileOffer,
//     offeredFiles,
//     addOfferedFiles,
//     setDownloadFinished,
//     setUploadProgress,
//     setDownloadProgress,
//     setIsTransferring
//   } = useFileStore()
//   const { addToast } = useToastStore()

//   const sendWebRtcMessage = useCallback((socket: WebSocket | null, type: string, payload: any) => {
//     if (!socket) return
//     const message = JSON.stringify({ type, payload })
//     socket.send(message)
//   }, [])

//   const sendFile = useCallback(async (fileOffer: FileOffer, _socket: WebSocket | null) => {
//     const connection = getConnection(fileOffer.to)
//     if (!connection || !connection.dataChannel) return

//     const file = offeredFiles.get(fileOffer.id)?.[fileOffer.currentFile]
//     if (!file) return

//     setIsTransferring(true)
//     setUploadProgress(0)

//     const fileStream = file.stream()
//     const reader = fileStream.getReader()

//     const CHUNK_SIZE = 16384
//     connection.dataChannel.bufferedAmountLowThreshold = 1048576

//     let sentBytes = 0
//     const totalBytes = file.size

//     const readChunk = async (): Promise<void> => {
//       const { value, done } = await reader.read()
//       if (done) {
//         setUploadProgress(100)
//         setIsTransferring(false)
//         return
//       }
//       if (!value) return
//       let buf = value
//       while (buf.byteLength) {
//         while (connection.dataChannel!.bufferedAmount > connection.dataChannel!.bufferedAmountLowThreshold) {
//           await new Promise(resolve => { if (connection.dataChannel) connection.dataChannel.onbufferedamountlow = resolve })
//         }
//         const chunk = buf.slice(0, CHUNK_SIZE)
//         buf = buf.slice(CHUNK_SIZE)
//         connection.dataChannel!.send(chunk)
//         sentBytes += chunk.byteLength
//         const progress = Math.round((sentBytes / totalBytes) * 100)
//         setUploadProgress(progress)
//       }
//       await readChunk()
//     }

//     await readChunk()
//   }, [getConnection, offeredFiles, setIsTransferring, setUploadProgress])

//   const buildFile = useCallback(async (chunk: ArrayBuffer) => {
//     console.log("Building file", chunk.byteLength)
//     const offer = currentFileOffer
//     if (!offer) {
//       console.error("No current file offer")
//       return
//     }

//     const file = offer.files[offer.currentFile]

//     if (!stream) {
//       stream = StreamSaver.createWriteStream(file.name, { size: file.size })
//       writer = stream.getWriter()
//       setIsTransferring(true)
//       setDownloadProgress(0)
//     }

//     const buffer = new Uint8Array(chunk)
//     await writer?.write(buffer).catch(console.error)
//     accSize += buffer.byteLength
//     file.accSize = accSize
//     updateCurrentFileOffer(offer)

//     const progress = Math.round((accSize / file.size) * 100)
//     setDownloadProgress(progress)

//     if (accSize === file.size) {
//       await writer?.close().catch(console.error)
//       stream = null
//       writer = null
//       accSize = 0
//       setIsTransferring(false)
//       setDownloadProgress(100)
//       if (offer.currentFile === offer.files.length - 1) {
//         setDownloadFinished(true)
//         setCurrentFileOffer(null)
//         nextFileOffer()
//       }
//       if (offer.currentFile < offer.files.length - 1) {
//         offer.currentFile++
//         requestNextFile(offer)
//       }
//     }
//   }, [currentFileOffer, updateCurrentFileOffer, setDownloadFinished, setCurrentFileOffer, nextFileOffer, setIsTransferring, setDownloadProgress])

//   const requestNextFile = useCallback((offer: FileOffer) => {
//     offer.type = FileOfferType.RequestNextFile
//     const connection = getConnection(offer.from)
//     if (connection && connection.dataChannel) {
//       connection.dataChannel.send(JSON.stringify(offer))
//     }
//   }, [getConnection])

//   const setupDataChannelListeners = useCallback((connection: Connection, socket: WebSocket | null) => {
//     if (!connection.dataChannel) return

//     connection.dataChannel.onopen = () => {
//       const currentIdentity = identityRef.current || identity
//       const currentFilesUploaded = filesUploadedRef.current || filesUploaded
//       console.log("Data channel opened", { filesUploaded: currentFilesUploaded, identity: currentIdentity?.id })
//       const isReceiver = currentFilesUploaded === null
//       console.log("Is receiver:", isReceiver)
//       if (!isReceiver) {
//         console.log("Sender side - waiting for ReadyForOffer from receiver")
//         return
//       }
//       console.log("Receiver side - sending ReadyForOffer to sender")
//       const payload = {
//         userId: currentIdentity?.id,
//         type: FileOfferType.ReadyForOffer
//       }
//       connection.dataChannel?.send(JSON.stringify(payload))
//     }

//     connection.dataChannel.onclose = () => {
//       console.log("Data channel closed")
//     }

//     connection.dataChannel.onmessage = (event) => {
//       console.log("Data channel message", event.data)
//       if (typeof event.data === "string") {
//         const data = JSON.parse(event.data)
//         switch (data.type) {
//           case FileOfferType.Offer:
//             addIncomingFileOffer(data)
//             break
//           case FileOfferType.AcceptOffer:
//             addToast({
//               type: ToastType.Success,
//               title: "File Transfer",
//               description: "A user has started downloading"
//             })
//             sendFile(data, socket)
//             break
//           case FileOfferType.DenyOffer:
//             console.log("The offer was denied :(")
//             break
//           case FileOfferType.RequestNextFile:
//             console.log("Requesting next file")
//             sendFile(data, socket)
//             break
//           case FileOfferType.ReadyForOffer:
//             console.log("The other party is ready to receive files", { filesUploaded, userId: data.userId })
//             const files = filesUploadedRef.current || filesUploaded
//             if (!files) {
//               console.log("No files uploaded to send!")
//               return
//             }
//             console.log("Creating file offer with", files.length, "files")
//             createFilesOffer(files, data.userId)
//             break
//         }
//       }

//       if (event.data instanceof ArrayBuffer) {
//         buildFile(event.data)
//       }
//     }
//   }, [filesUploaded, identity, addIncomingFileOffer, addToast, sendFile, buildFile])

//   const setupPeerConnectionListeners = useCallback((connection: Connection, socket: WebSocket | null) => {
//     connection.peerConnection.onicecandidate = (event) => {
//       if (event.candidate) {
//         const currentRoom = roomRef.current || room
//         const currentIdentity = identityRef.current || identity
//         console.log("Sending ICE_CANDIDATE with roomId:", currentRoom?.id)
//         const payload = {
//           roomId: currentRoom?.id,
//           candidate: event.candidate,
//           from: currentIdentity?.id,
//           to: connection.target,
//         }
//         sendWebRtcMessage(socket, "ICE_CANDIDATE", payload)
//       }
//     }

//     connection.peerConnection.oniceconnectionstatechange = () => {
//       console.log("ICE Connection State Change", connection.peerConnection.iceConnectionState)
//     }

//     connection.peerConnection.ondatachannel = (event) => {
//       connection.dataChannel = event.channel
//       connection.dataChannel.binaryType = "arraybuffer"
//       setupDataChannelListeners(connection, socket)
//     }
//   }, [room, identity, sendWebRtcMessage, setupDataChannelListeners])

//   const createRtcOffer = useCallback(async (socket: WebSocket | null, target: string) => {
//     console.log("createRtcOffer called for target:", target)
//     if (getConnection(target)) {
//       console.log("Connection already exists for target:", target)
//       return
//     }

//     const currentRoom = roomRef.current || room
//     const currentIdentity = identityRef.current || identity

//     if (!currentRoom?.id) {
//       console.error("CRITICAL: Cannot create RTC offer - room is not set yet. roomRef:", roomRef.current, "room:", room)
//       return
//     }

//     console.log("Creating new RTCPeerConnection with roomId:", currentRoom.id)
//     const peerConnection = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] })
//     const dataChannel = peerConnection.createDataChannel("files")
//     dataChannel.binaryType = "arraybuffer"

//     const connection: Connection = {
//       peerConnection,
//       dataChannel,
//       target
//     }

//     setConnection(target, connection)
//     setupPeerConnectionListeners(connection, socket)
//     setupDataChannelListeners(connection, socket)

//     console.log("Creating WebRTC offer")
//     const offer = await connection.peerConnection.createOffer()
//     await connection.peerConnection.setLocalDescription(offer)

//     const payload = {
//       roomId: currentRoom.id,
//       offer: offer,
//       from: currentIdentity?.id,
//       to: target,
//     }

//     console.log("Sending OFFER via WebSocket to target:", target, "with roomId:", currentRoom.id)
//     sendWebRtcMessage(socket, "OFFER", payload)
//   }, [getConnection, setConnection, setupPeerConnectionListeners, setupDataChannelListeners, room, identity, sendWebRtcMessage])

//   const handleRtcOffer = useCallback(async (socket: WebSocket | null, data: any) => {
//     console.log("Handle offer", data)
//     const currentRoom = roomRef.current || room
//     const currentIdentity = identityRef.current || identity

//     if (!currentRoom?.id) {
//       console.error("CRITICAL: Cannot handle RTC offer - room is not set yet. roomRef:", roomRef.current, "room:", room)
//       return
//     }

//     const peerConnection = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] })

//     const connection: Connection = {
//       peerConnection,
//       dataChannel: undefined as any,
//       target: data.payload.from
//     }

//     setConnection(data.payload.from, connection)
//     setupPeerConnectionListeners(connection, socket)

//     await connection.peerConnection.setRemoteDescription(data.payload.offer).catch(console.error)
//     const answer = await connection.peerConnection.createAnswer()
//     await connection.peerConnection.setLocalDescription(answer)

//     const payload = {
//       roomId: currentRoom.id,
//       answer: answer,
//       from: currentIdentity?.id,
//       to: data.from,
//     }

//     console.log("Sending ANSWER with roomId:", currentRoom.id)
//     sendWebRtcMessage(socket, "ANSWER", payload)
//   }, [setConnection, setupPeerConnectionListeners, room, identity, sendWebRtcMessage])

//   const handleRtcAnswer = useCallback(async (data: any) => {
//     const connection = getConnection(data.payload.from)
//     if (!connection) {
//       console.error("Handle Answer", "Connection not found")
//       return
//     }
//     await connection.peerConnection.setRemoteDescription(data.payload.answer).catch(console.error)
//   }, [getConnection])

//   const handleIceCandidate = useCallback(async (data: any) => {
//     const connection = getConnection(data.payload.from)
//     if (!connection) {
//       console.error("Handle ICE Candidate", "Connection not found")
//       return
//     }
//     await connection.peerConnection.addIceCandidate(data.payload.candidate).catch(console.error)
//   }, [getConnection])

//   const closeWebRtcConnection = useCallback(async (target: string) => {
//     const connection = getConnection(target)
//     if (!connection) return
//     connection.peerConnection.close()
//     connection.dataChannel?.close()
//     deleteConnection(target)
//   }, [getConnection, deleteConnection])

//   const closeAllWebRtcConnections = useCallback(() => {
//     clearConnections()
//   }, [clearConnections])

//   const createFilesOffer = useCallback((files: FileList, target: string) => {
//     const currentIdentity = identityRef.current || identity
//     const messages: any[] = []
//     for (let i = 0; i < files.length; i++) {
//       messages.push({
//         name: files[i].name,
//         size: files[i].size,
//         mime: files[i].type,
//       })
//     }

//     const offer: FileOffer = {
//       id: uuidv4(),
//       type: FileOfferType.Offer,
//       files: messages as any,
//       from: currentIdentity?.id || '',
//       currentFile: 0,
//       to: target,
//     }
//     addOfferedFiles(offer.id, files)

//     const connection = getConnection(target)
//     if (connection && connection.dataChannel) {
//       console.log("Sending file offer from:", currentIdentity?.id, "to:", target)
//       connection.dataChannel.send(JSON.stringify(offer))
//     }
//   }, [identity, addOfferedFiles, getConnection])

//   const createFilesOffers = useCallback((files: FileList) => {
//     if (files.length === 0) return
//     connections.forEach((connection, target) => {
//       if (connection.peerConnection.connectionState === "connected" && connection.dataChannel) {
//         createFilesOffer(files, target)
//       }
//     })
//   }, [connections, createFilesOffer])

//   const acceptIncomingFileOffer = useCallback(() => {
//     const offer = currentFileOffer
//     if (offer) {
//       const connection = getConnection(offer.from)
//       if (connection && connection.dataChannel) {
//         // offer.type = FileOfferType.AcceptOffer
//         // connection.dataChannel.send(JSON.stringify(offer))

//         connection.dataChannel.send(JSON.stringify({
//   type: FileOfferType.AcceptOffer,
//   offerId: offer.id,
//   from: offer.from,
//   to: offer.to,
//   currentFile: offer.currentFile
// }))

//       }
//     }
//   }, [currentFileOffer, getConnection])

//   const denyIncomingFileOffer = useCallback(() => {
//     const offer = currentFileOffer
//     if (offer) {
//       const connection = getConnection(offer.from)
//       if (connection && connection.dataChannel) {
//         // offer.type = FileOfferType.DenyOffer
//         // connection.dataChannel.send(JSON.stringify(offer))

//         connection.dataChannel.send(JSON.stringify({
//   type: FileOfferType.AcceptOffer,
//   offerId: offer.id,
//   from: offer.from,
//   to: offer.to,
//   currentFile: offer.currentFile
// }))

//       }
//     }
//     setCurrentFileOffer(null)
//   }, [currentFileOffer, getConnection, setCurrentFileOffer])

//   return {
//     createRtcOffer,
//     handleRtcOffer,
//     handleRtcAnswer,
//     handleIceCandidate,
//     closeWebRtcConnection,
//     closeAllWebRtcConnections,
//     createFilesOffer,
//     createFilesOffers,
//     acceptIncomingFileOffer,
//     denyIncomingFileOffer,
//     updateRoomRef,
//     updateIdentityRef,
//     updateFilesUploadedRef,
//   }
// }


import { useCallback, useRef, useEffect } from 'react'
import { useConnectionStore } from '@/stores/useConnectionStore'
import { useSocketStore } from '@/stores/useSocketStore'
import { useFileStore } from '@/stores/useFileStore'
import { useToastStore } from '@/stores/useToastStore'
import { Connection } from '@/types/connection'
import { FileOfferType, FileOffer } from '@/types/file'
import { ToastType } from '@/types/toast'
import StreamSaver from 'streamsaver'
import { v4 as uuidv4 } from 'uuid'

StreamSaver.mitm = `/StreamSaver/mitm.html?version=2.0.6`

let stream: WritableStream<Uint8Array> | null = null
let writer: WritableStreamDefaultWriter<Uint8Array> | null = null
let accSize = 0

export function useWebRTC() {
  const { setConnection, getConnection, deleteConnection, clearConnections, connections } = useConnectionStore()
  const { identity, room } = useSocketStore()
  const roomRef = useRef<any>(null)
  const identityRef = useRef<any>(null)
  const filesUploadedRef = useRef<FileList | null>(null)
  
  // Create a local ref to store offered files that persists across renders
  const offeredFilesRef = useRef<Map<string, FileList>>(new Map())
  
  // Store the current download offer in a ref to prevent it from being cleared by UI
  const activeDownloadOfferRef = useRef<FileOffer | null>(null)

  // Keep refs in sync with store values
  useEffect(() => {
    if (room) {
      console.log("useWebRTC: Updating roomRef with room:", room.id)
      roomRef.current = room
    }
  }, [room])

  useEffect(() => {
    if (identity) {
      console.log("useWebRTC: Updating identityRef with identity:", identity.id)
      identityRef.current = identity
    }
  }, [identity])

  // Expose method to update refs directly for immediate synchronous updates
  const updateRoomRef = useCallback((newRoom: any) => {
    console.log("useWebRTC: updateRoomRef called with room:", newRoom?.id)
    roomRef.current = newRoom
  }, [])

  const updateIdentityRef = useCallback((newIdentity: any) => {
    console.log("useWebRTC: updateIdentityRef called with identity:", newIdentity?.id)
    identityRef.current = newIdentity
  }, [])

  const updateFilesUploadedRef = useCallback((files: FileList | null) => {
    console.log("useWebRTC: updateFilesUploadedRef called with files:", files?.length || 0, "files")
    filesUploadedRef.current = files
  }, [])

  const {
    filesUploaded,
    addIncomingFileOffer,
    currentFileOffer,
    setCurrentFileOffer,
    updateCurrentFileOffer,
    nextFileOffer,
    offeredFiles,
    addOfferedFiles,
    setDownloadFinished,
    setUploadProgress,
    setDownloadProgress,
    setIsTransferring
  } = useFileStore()
  const { addToast } = useToastStore()

  const sendWebRtcMessage = useCallback((socket: WebSocket | null, type: string, payload: any) => {
    if (!socket) return
    const message = JSON.stringify({ type, payload })
    socket.send(message)
  }, [])

  const sendFile = useCallback(async (fileOffer: FileOffer, _socket: WebSocket | null) => {
    console.log("sendFile called with offer:", fileOffer)
    console.log("Available offeredFiles in ref:", Array.from(offeredFilesRef.current.keys()))
    console.log("Available offeredFiles in store:", Array.from(offeredFiles.keys()))
    
    // The target is whoever we're sending TO
    const targetUserId = fileOffer.to
    const connection = getConnection(targetUserId)
    
    if (!connection || !connection.dataChannel) {
      // console.error("sendFile: No connection or data channel found for target:", targetUserId)
      return
    }

    // Try to get files from ref first (more reliable), then fall back to store
    let fileList = offeredFilesRef.current.get(fileOffer.id)
    if (!fileList) {
      fileList = offeredFiles.get(fileOffer.id)
    }
    
    if (!fileList) {
      // console.error("sendFile: No files found for offer ID:", fileOffer.id)
      // console.error("Available offer IDs in ref:", Array.from(offeredFilesRef.current.keys()))
      // console.error("Available offer IDs in store:", Array.from(offeredFiles.keys()))
      return
    }
    
    const file = fileList[fileOffer.currentFile]
    if (!file) {
      // console.error("sendFile: No file found at index:", fileOffer.currentFile, "in offer:", fileOffer.id)
      return
    }

    console.log("Starting file transfer:", file.name, "size:", file.size, "to:", targetUserId)
    setIsTransferring(true)
    setUploadProgress(0)

    const fileStream = file.stream()
    const reader = fileStream.getReader()

    const CHUNK_SIZE = 16384
    connection.dataChannel.bufferedAmountLowThreshold = 1048576

    let sentBytes = 0
    const totalBytes = file.size

    const readChunk = async (): Promise<void> => {
      const { value, done } = await reader.read()
      if (done) {
        console.log("File transfer complete:", file.name)
        setUploadProgress(100)
        setIsTransferring(false)
        return
      }
      if (!value) return
      let buf = value
      while (buf.byteLength) {
        while (connection.dataChannel!.bufferedAmount > connection.dataChannel!.bufferedAmountLowThreshold) {
          await new Promise(resolve => { if (connection.dataChannel) connection.dataChannel.onbufferedamountlow = resolve })
        }
        const chunk = buf.slice(0, CHUNK_SIZE)
        buf = buf.slice(CHUNK_SIZE)
        connection.dataChannel!.send(chunk)
        sentBytes += chunk.byteLength
        const progress = Math.round((sentBytes / totalBytes) * 100)
        setUploadProgress(progress)
      }
      await readChunk()
    }

    await readChunk()
  }, [getConnection, offeredFiles, setIsTransferring, setUploadProgress])

  const requestNextFile = useCallback((offer: FileOffer) => {
    const requestOffer = {
      ...offer,
      type: FileOfferType.RequestNextFile
    }
    const connection = getConnection(offer.from)
    if (connection && connection.dataChannel) {
      console.log("Requesting next file:", requestOffer.currentFile)
      connection.dataChannel.send(JSON.stringify(requestOffer))
    }
  }, [getConnection])

  const buildFile = useCallback(async (chunk: ArrayBuffer) => {
    console.log("Building file chunk:", chunk.byteLength, "bytes")
    
    // Try to get offer from ref first (more reliable), then from store
    let offer = activeDownloadOfferRef.current
    if (!offer) {
      offer = currentFileOffer
      if (offer) {
        // Store it in ref for subsequent chunks
        console.log("Storing offer in ref from store:", offer.id)
        activeDownloadOfferRef.current = offer
      }
    }
    
    if (!offer) {
      console.error("CRITICAL: No current file offer when receiving data chunk!")
      console.error("Both activeDownloadOfferRef and currentFileOffer are null")
      return
    }

    console.log("Current offer:", offer.id, "file:", offer.currentFile + 1, "of", offer.files.length)
    const file = offer.files[offer.currentFile]

    if (!stream) {
      console.log("Creating new write stream for:", file.name, "size:", file.size)
      stream = StreamSaver.createWriteStream(file.name, { size: file.size })
      writer = stream.getWriter()
      setIsTransferring(true)
      setDownloadProgress(0)
    }

    const buffer = new Uint8Array(chunk)
    await writer?.write(buffer).catch(console.error)
    accSize += buffer.byteLength
    file.accSize = accSize
    
    // Update both ref and store
    activeDownloadOfferRef.current = offer
    updateCurrentFileOffer(offer)

    const progress = Math.round((accSize / file.size) * 100)
    setDownloadProgress(progress)
    
    if (progress % 10 === 0 || accSize === file.size) {
      console.log("Download progress:", progress + "%", `(${accSize}/${file.size})`)
    }

    if (accSize === file.size) {
      console.log("File download complete:", file.name)
      await writer?.close().catch(console.error)
      stream = null
      writer = null
      accSize = 0
      setIsTransferring(false)
      setDownloadProgress(100)
      
      if (offer.currentFile === offer.files.length - 1) {
        console.log("All files downloaded")
        setDownloadFinished(true)
        setCurrentFileOffer(null)
        activeDownloadOfferRef.current = null
        nextFileOffer()
      } else if (offer.currentFile < offer.files.length - 1) {
        console.log("Requesting next file")
        offer.currentFile++
        activeDownloadOfferRef.current = offer
        requestNextFile(offer)
      }
    }
  }, [currentFileOffer, updateCurrentFileOffer, setDownloadFinished, setCurrentFileOffer, nextFileOffer, setIsTransferring, setDownloadProgress, requestNextFile])



  const setupDataChannelListeners = useCallback((connection: Connection, socket: WebSocket | null) => {
    if (!connection.dataChannel) return

    connection.dataChannel.onopen = () => {
      const currentIdentity = identityRef.current || identity
      const currentFilesUploaded = filesUploadedRef.current || filesUploaded
      console.log("Data channel opened", { filesUploaded: currentFilesUploaded, identity: currentIdentity?.id })
      const isReceiver = currentFilesUploaded === null
      console.log("Is receiver:", isReceiver)
      if (!isReceiver) {
        console.log("Sender side - waiting for ReadyForOffer from receiver")
        return
      }
      console.log("Receiver side - sending ReadyForOffer to sender")
      const payload = {
        userId: currentIdentity?.id,
        type: FileOfferType.ReadyForOffer
      }
      connection.dataChannel?.send(JSON.stringify(payload))
    }

    connection.dataChannel.onclose = () => {
      console.log("Data channel closed")
    }

    connection.dataChannel.onmessage = (event) => {
      console.log("Data channel message", event.data)
      if (typeof event.data === "string") {
        const data = JSON.parse(event.data)
        switch (data.type) {
          case FileOfferType.Offer:
            console.log("Received file offer:", data)
            // Store the offer in ref when it arrives
            activeDownloadOfferRef.current = data
            console.log("Stored incoming offer in activeDownloadOfferRef:", data.id)
            addIncomingFileOffer(data)
            break
          case FileOfferType.AcceptOffer:
            console.log("Receiver accepted the offer, starting file transfer")
            addToast({
              type: ToastType.Success,
              title: "File Transfer",
              description: "A user has started downloading"
            })
            // The data contains the accepted offer - send the file
            sendFile(data, socket)
            break
          case FileOfferType.DenyOffer:
            console.log("The offer was denied :(")
            addToast({
              type: ToastType.Success,
              title: "File Transfer",
              description: "A user declined the file transfer"
            })
            break
          case FileOfferType.RequestNextFile:
            console.log("Requesting next file")
            sendFile(data, socket)
            break
          case FileOfferType.ReadyForOffer:
            console.log("The other party is ready to receive files", { filesUploaded, userId: data.userId })
            const files = filesUploadedRef.current || filesUploaded
            if (!files) {
              console.log("No files uploaded to send!")
              return
            }
            console.log("Creating file offer with", files.length, "files")
            createFilesOffer(files, data.userId)
            break
        }
      }

      if (event.data instanceof ArrayBuffer) {
        buildFile(event.data)
      }
    }
  }, [filesUploaded, identity, addIncomingFileOffer, addToast, sendFile, buildFile])

  const setupPeerConnectionListeners = useCallback((connection: Connection, socket: WebSocket | null) => {
    connection.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        const currentRoom = roomRef.current || room
        const currentIdentity = identityRef.current || identity
        console.log("Sending ICE_CANDIDATE with roomId:", currentRoom?.id)
        const payload = {
          roomId: currentRoom?.id,
          candidate: event.candidate,
          from: currentIdentity?.id,
          to: connection.target,
        }
        sendWebRtcMessage(socket, "ICE_CANDIDATE", payload)
      }
    }

    connection.peerConnection.oniceconnectionstatechange = () => {
      console.log("ICE Connection State Change", connection.peerConnection.iceConnectionState)
    }

    connection.peerConnection.ondatachannel = (event) => {
      connection.dataChannel = event.channel
      connection.dataChannel.binaryType = "arraybuffer"
      setupDataChannelListeners(connection, socket)
    }
  }, [room, identity, sendWebRtcMessage, setupDataChannelListeners])

  const createRtcOffer = useCallback(async (socket: WebSocket | null, target: string) => {
    console.log("createRtcOffer called for target:", target)
    if (getConnection(target)) {
      console.log("Connection already exists for target:", target)
      return
    }

    const currentRoom = roomRef.current || room
    const currentIdentity = identityRef.current || identity

    if (!currentRoom?.id) {
      console.error("CRITICAL: Cannot create RTC offer - room is not set yet. roomRef:", roomRef.current, "room:", room)
      return
    }

    console.log("Creating new RTCPeerConnection with roomId:", currentRoom.id)
    const peerConnection = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] })
    const dataChannel = peerConnection.createDataChannel("files")
    dataChannel.binaryType = "arraybuffer"

    const connection: Connection = {
      peerConnection,
      dataChannel,
      target
    }

    setConnection(target, connection)
    setupPeerConnectionListeners(connection, socket)
    setupDataChannelListeners(connection, socket)

    console.log("Creating WebRTC offer")
    const offer = await connection.peerConnection.createOffer()
    await connection.peerConnection.setLocalDescription(offer)

    const payload = {
      roomId: currentRoom.id,
      offer: offer,
      from: currentIdentity?.id,
      to: target,
    }

    console.log("Sending OFFER via WebSocket to target:", target, "with roomId:", currentRoom.id)
    sendWebRtcMessage(socket, "OFFER", payload)
  }, [getConnection, setConnection, setupPeerConnectionListeners, setupDataChannelListeners, room, identity, sendWebRtcMessage])

  const handleRtcOffer = useCallback(async (socket: WebSocket | null, data: any) => {
    console.log("Handle offer", data)
    const currentRoom = roomRef.current || room
    const currentIdentity = identityRef.current || identity

    if (!currentRoom?.id) {
      console.error("CRITICAL: Cannot handle RTC offer - room is not set yet. roomRef:", roomRef.current, "room:", room)
      return
    }

    const peerConnection = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] })

    const connection: Connection = {
      peerConnection,
      dataChannel: undefined as any,
      target: data.payload.from
    }

    setConnection(data.payload.from, connection)
    setupPeerConnectionListeners(connection, socket)

    await connection.peerConnection.setRemoteDescription(data.payload.offer).catch(console.error)
    const answer = await connection.peerConnection.createAnswer()
    await connection.peerConnection.setLocalDescription(answer)

    const payload = {
      roomId: currentRoom.id,
      answer: answer,
      from: currentIdentity?.id,
      to: data.from,
    }

    console.log("Sending ANSWER with roomId:", currentRoom.id)
    sendWebRtcMessage(socket, "ANSWER", payload)
  }, [setConnection, setupPeerConnectionListeners, room, identity, sendWebRtcMessage])

  const handleRtcAnswer = useCallback(async (data: any) => {
    const connection = getConnection(data.payload.from)
    if (!connection) {
      console.error("Handle Answer", "Connection not found")
      return
    }
    await connection.peerConnection.setRemoteDescription(data.payload.answer).catch(console.error)
  }, [getConnection])

  const handleIceCandidate = useCallback(async (data: any) => {
    const connection = getConnection(data.payload.from)
    if (!connection) {
      console.error("Handle ICE Candidate", "Connection not found")
      return
    }
    await connection.peerConnection.addIceCandidate(data.payload.candidate).catch(console.error)
  }, [getConnection])

  const closeWebRtcConnection = useCallback(async (target: string) => {
    const connection = getConnection(target)
    if (!connection) return
    connection.peerConnection.close()
    connection.dataChannel?.close()
    deleteConnection(target)
  }, [getConnection, deleteConnection])

  const closeAllWebRtcConnections = useCallback(() => {
    clearConnections()
  }, [clearConnections])

  const createFilesOffer = useCallback((files: FileList, target: string) => {
    const currentIdentity = identityRef.current || identity
    const messages: any[] = []
    for (let i = 0; i < files.length; i++) {
      messages.push({
        name: files[i].name,
        size: files[i].size,
        mime: files[i].type,
      })
    }

    const offer: FileOffer = {
      id: uuidv4(),
      type: FileOfferType.Offer,
      files: messages as any,
      from: currentIdentity?.id || '',
      currentFile: 0,
      to: target,
    }
    
    // Store the actual File objects with the offer ID in BOTH ref and store
    console.log("Storing files for offer ID:", offer.id, "Files:", files.length)
    offeredFilesRef.current.set(offer.id, files)
    addOfferedFiles(offer.id, files)
    
    console.log("Files stored in ref. Current ref keys:", Array.from(offeredFilesRef.current.keys()))

    const connection = getConnection(target)
    if (connection && connection.dataChannel) {
      console.log("Sending file offer from:", currentIdentity?.id, "to:", target, "with ID:", offer.id)
      connection.dataChannel.send(JSON.stringify(offer))
    } else {
      // console.error("No data channel available to send offer")
    }
  }, [identity, addOfferedFiles, getConnection])

  const createFilesOffers = useCallback((files: FileList) => {
    if (files.length === 0) return
    connections.forEach((connection, target) => {
      if (connection.peerConnection.connectionState === "connected" && connection.dataChannel) {
        createFilesOffer(files, target)
      }
    })
  }, [connections, createFilesOffer])

  const acceptIncomingFileOffer = useCallback(() => {
    console.log("=== acceptIncomingFileOffer called ===")
    console.log("currentFileOffer from store:", currentFileOffer)
    console.log("activeDownloadOfferRef.current:", activeDownloadOfferRef.current)
    
    const offer = currentFileOffer || activeDownloadOfferRef.current
    if (!offer) {
      console.error("acceptIncomingFileOffer: No current file offer in store or ref")
      return
    }
    
    const connection = getConnection(offer.from)
    if (!connection || !connection.dataChannel) {
      console.error("acceptIncomingFileOffer: No connection or data channel found")
      return
    }

    console.log("Accepting file offer:", offer.id, "from:", offer.from)
    
    // Store the offer in the ref so it persists even if the UI clears it
    activeDownloadOfferRef.current = offer
    console.log("Stored offer in activeDownloadOfferRef for download:", offer.id)
    console.log("activeDownloadOfferRef.current is now:", activeDownloadOfferRef.current)
    
    // Send the complete offer back with AcceptOffer type
    const acceptMessage = {
      type: FileOfferType.AcceptOffer,
      id: offer.id,
      files: offer.files,
      from: offer.from,
      to: offer.to,
      currentFile: offer.currentFile
    }
    
    console.log("Sending accept message:", acceptMessage)
    connection.dataChannel.send(JSON.stringify(acceptMessage))
    console.log("=== acceptIncomingFileOffer complete ===")
  }, [currentFileOffer, getConnection])

  const denyIncomingFileOffer = useCallback(() => {
    const offer = currentFileOffer
    if (!offer) {
      console.error("denyIncomingFileOffer: No current file offer")
      return
    }
    
    const connection = getConnection(offer.from)
    if (connection && connection.dataChannel) {
      console.log("Denying file offer:", offer.id)
      
      const denyMessage = {
        type: FileOfferType.DenyOffer,
        id: offer.id,
        from: offer.from,
        to: offer.to,
        currentFile: offer.currentFile
      }
      
      console.log("Sending deny message:", denyMessage)
      connection.dataChannel.send(JSON.stringify(denyMessage))
    }
    
    setCurrentFileOffer(null)
    nextFileOffer()
  }, [currentFileOffer, getConnection, setCurrentFileOffer, nextFileOffer])

  return {
    createRtcOffer,
    handleRtcOffer,
    handleRtcAnswer,
    handleIceCandidate,
    closeWebRtcConnection,
    closeAllWebRtcConnections,
    createFilesOffer,
    createFilesOffers,
    acceptIncomingFileOffer,
    denyIncomingFileOffer,
    updateRoomRef,
    updateIdentityRef,
    updateFilesUploadedRef,
  }
}