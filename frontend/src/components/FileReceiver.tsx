import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  CircleX,
  Download,
  FileAudio,
  File as FileIcon,
  FileVideo,
  Frown,
  Image as ImageIcon,
  Loader2,
  Share,
  CheckCircle,
} from 'lucide-react'
import { useSocketStore } from '@/stores/useSocketStore'
import { useFileStore } from '@/stores/useFileStore'
import { useWebSocket } from '@/hooks/useWebSocket'
import { useWebRTC } from '@/hooks/useWebRTC'
import { formatFileSize } from '@/utils/filesize'
import { truncateFileName } from '@/utils/truncate'
import ProgressBar from './ProgressBar'

interface FileReceiverProps {
  roomId: string | undefined
}

export default function FileReceiver({ roomId }: FileReceiverProps) {
  const { isConnected, checkedRoomCode, roomExists, downloadCancelled, room } = useSocketStore()
  const { currentFileOffer, downloadFinished, downloadProgress, isTransferring } = useFileStore()
  const { connect, disconnect, setRoomIdToJoin } = useWebSocket()
  const { acceptIncomingFileOffer } = useWebRTC()

  useEffect(() => {
    if (!roomId) {
      console.error("RoomId is not defined")
      return
    }

    console.log("FileReceiver useEffect running, roomId:", roomId)
    console.log("About to call setRoomIdToJoin with:", roomId)
    setRoomIdToJoin(roomId)
    console.log("About to call connect()")
    connect()

    return () => {
      console.log("FileReceiver cleanup, disconnecting")
      disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId])

  const acceptFiles = () => {
    acceptIncomingFileOffer()
  }

  const getFileIcon = (mime: string) => {
    if (mime.startsWith("image/")) return <ImageIcon className="h-5 w-5" />
    if (mime.startsWith("audio/")) return <FileAudio className="h-5 w-5" />
    if (mime.startsWith("video/")) return <FileVideo className="h-5 w-5" />
    return <FileIcon className="h-5 w-5" />
  }

  const totalSize = currentFileOffer?.files.reduce((acc, file) => acc + file.size, 0) || 0

  return (
    <div className="card h-full min-h-svh sm:min-h-0 bg-base-100 w-screen sm:w-full sm:h-auto max-w-lg gap-3 space-y-6">
      <div className="card-body flex-col justify-between h-full md:h-auto gap-16">
        <div className="flex items-center space-x-4">
          <div className="bg-gray-100 p-2 rounded-full">
            <Share className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold modal-title">File transfer</p>
          </div>
        </div>

        {downloadFinished ? (
          <div>
            <p className="text-xl">Download finished!</p>
            <p className="text-gray-500">Your files have been successfully transferred.</p>
          </div>
        ) : downloadCancelled ? (
          <div>
            <CircleX className="w-32 h-32 mx-auto" />
            <p className="text-xl">Download cancelled</p>
            <p className="text-gray-500">
              The download has been cancelled by the sender.{' '}
              <Link className="link link-primary" to="/">
                Return to homepage
              </Link>
            </p>
          </div>
        ) : !isConnected || !checkedRoomCode ? (
          <div>
            <div className="flex flex-row gap-3">
              <Loader2 className="animate-spin" />
              <p className="text-base-content/70 text-lg">Setting up the connection</p>
            </div>
          </div>
        ) : currentFileOffer ? (
          <div className="space-y-4">
            {room && room.user_count > 1 && (
              <div className="alert alert-success">
                <CheckCircle className="h-5 w-5" />
                <span>Connected to sender!</span>
              </div>
            )}
            <ul className="space-y-2">
              {currentFileOffer.files.map((file, index) => (
                <li key={index} className="flex flex-col py-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(file.mime)}
                      <span className="font-medium">{truncateFileName(file.name)}</span>
                    </div>
                    <span className="text-gray-500 text-sm">{formatFileSize(file.size)}</span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <span className="text-gray-500">Total size: {formatFileSize(totalSize)}</span>
            </div>
            {isTransferring && (
              <div className="mt-4">
                <ProgressBar
                  progress={downloadProgress}
                  fileName={currentFileOffer.files[currentFileOffer.currentFile]?.name}
                  isUploading={false}
                />
              </div>
            )}
          </div>
        ) : (!roomExists && checkedRoomCode && isConnected) || room?.user_count === 1 ? (
          <div>
            <Frown className="w-32 h-32 mx-auto" />
            <p className="text-xl">Invalid link</p>
            <p className="text-gray-500">
              The link you received is incorrect. Please try again.{' '}
              <Link className="link link-primary" to="/">
                Return to homepage
              </Link>
            </p>
          </div>
        ) : (
          <div>
            <div className="flex flex-row gap-3">
              <Loader2 className="animate-spin" />
              <p className="text-base-content/70 text-lg">Waiting for file(s)...</p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {!downloadFinished && (
            <button
              disabled={!isConnected || !currentFileOffer || isTransferring}
              onClick={acceptFiles}
              className="btn btn-primary w-full"
            >
              <Download className="h-5 w-5" />
              {isTransferring ? 'Downloading...' : 'Start download'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
