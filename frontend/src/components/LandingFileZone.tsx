import { useState, useEffect, useRef } from 'react'
import { Upload, X, Download, CheckCircle } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useNavigate } from 'react-router-dom'
import { useSocketStore } from '@/stores/useSocketStore'
import { useFileStore } from '@/stores/useFileStore'
import { useToastStore } from '@/stores/useToastStore'
import { useWebSocket } from '@/hooks/useWebSocket'
import { formatFileSize } from '@/utils/filesize'
import { truncateFileName } from '@/utils/truncate'
import { ToastType } from '@/types/toast'
import QrButton from './QrButton'
import LinkButton from './LinkButton'
import ShareButton from './ShareButton'
import ProgressBar from './ProgressBar'

export default function LandingFileZone() {
  const [filesToSend, setFilesToSend] = useState<FileList | null>(null)
  const [link, setLink] = useState('loading...')
  const [isDragging, setIsDragging] = useState(false)
  const [_dragCounter, setDragCounter] = useState(0)
  const [showReceiveInput, setShowReceiveInput] = useState(false)
  const [receiveLinkInput, setReceiveLinkInput] = useState('')
  const debounceTimerRef = useRef<NodeJS.Timeout>()
  const navigate = useNavigate()

  const { roomId, room } = useSocketStore()
  const { setFilesUploaded, uploadProgress, isTransferring } = useFileStore()
  const { addToast } = useToastStore()
  const { connect, disconnect, sendCancelDownload, updateFilesUploadedRef } = useWebSocket()

  useEffect(() => {
    if (roomId) {
      setLink(`${window.location.protocol}//${window.location.host}/r/${roomId}`)
    }
  }, [roomId])

  const debounce = <T extends (...args: any[]) => void>(func: T, delay: number) => {
    return (...args: Parameters<T>) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
      debounceTimerRef.current = setTimeout(() => func(...args), delay)
    }
  }

  const setDraggingDebounced = debounce((value: boolean) => {
    setIsDragging(value)
  }, 100)

  const handleFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      handleFilesSelected(files)
    }
  }

  const handleFilesSelected = (files: FileList) => {
    if (!files || files.length === 0) return
    console.log('Selected files:', files)
    setFilesToSend(files)
    updateFilesUploadedRef(files) // Set ref immediately for synchronous access
    setFilesUploaded(files) // Also update store
    addToast({
      type: ToastType.Success,
      title: "Files selected",
      description: `You have selected ${files.length} files to send.`
    }, 5000)
    connect()
  }

  const cancelUpload = () => {
    setTimeout(() => {
      sendCancelDownload()
      setFilesToSend(null)
      setFilesUploaded(null)
      disconnect()
    }, 100)
  }

  const handleReceiveClick = () => {
    setShowReceiveInput(!showReceiveInput)
  }

  const handleReceiveLinkSubmit = () => {
    const roomIdMatch = receiveLinkInput.match(/\/r\/([^/]+)/)
    if (roomIdMatch && roomIdMatch[1]) {
      navigate(`/r/${roomIdMatch[1]}`)
    } else {
      addToast({
        type: ToastType.Error,
        title: "Invalid Link",
        description: "Please enter a valid share link."
      }, 5000)
    }
  }

  const handleDragEnter = (event: React.DragEvent) => {
    event.preventDefault()
    setDragCounter(prev => prev + 1)
    setDraggingDebounced(true)
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    setDragCounter(prev => {
      const newCounter = prev - 1
      if (newCounter === 0) {
        setDraggingDebounced(false)
      }
      return newCounter
    })
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setDragCounter(0)
    setDraggingDebounced(false)
    const files = event.dataTransfer?.files
    if (files) {
      handleFilesSelected(files)
    }
  }

  const totalSize = filesToSend ? Array.from(filesToSend).reduce((total, file) => total + file.size, 0) : 0

  return (
    <>
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="fixed inset-0 pointer-events-none z-40"
      />

      {isDragging && !filesToSend && (
        <div
          className="fixed inset-0 bg-primary bg-opacity-75 z-50 flex items-center justify-center"
          onClick={() => setIsDragging(false)}
          onKeyDown={(e) => { if (e.key === "Escape") setIsDragging(false) }}
          role="button"
          tabIndex={0}
        >
          <div className="relative w-full h-full max-w-[85vw] max-h-[85vh] m-8">
            <div className="absolute top-0 left-0 w-16 h-16 border-t-[16px] border-l-[16px] border-white rounded-tl-3xl"></div>
            <div className="absolute top-0 right-0 w-16 h-16 border-t-[16px] border-r-[16px] border-white rounded-tr-3xl"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-[16px] border-l-[16px] border-white rounded-bl-3xl"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-[16px] border-r-[16px] border-white rounded-br-3xl"></div>
            <div className="flex items-center justify-center h-full">
              <h3 className="text-4xl lg:text-6xl font-black text-white text-center">Drop files anywhere.</h3>
            </div>
          </div>
        </div>
      )}

      <div className="hidden sm:flex flex-col max-w-md gap-4">
        <label
          htmlFor="files"
          className={`card card-bordered card-compact bg-base-100 min-w-md min-h-96 w-96 transition-transform duration-200 ${!filesToSend ? 'hover:scale-105' : ''}`}
        >
          <div className="card-body flex items-center justify-center gap-8 w-full">
            {!filesToSend || filesToSend.length === 0 ? (
              <>
                <div>
                  <Upload className="h-16 w-16" />
                </div>
                <div className="space-y-4">
                  <label htmlFor="files" className="btn btn-primary btn-wide shadow-xl">
                    <Upload className="h-5 w-5" />
                    Send file(s)
                  </label>
                  <p className="font-semibold">Or drop file(s)</p>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-16">
                <div className="text-left space-y-4">
                  {filesToSend.length > 1 ? (
                    <h2 className="text-xl font-semibold">Multiple files ({filesToSend.length})</h2>
                  ) : (
                    <h2 className="text-xl font-semibold text-wrap">{truncateFileName(filesToSend.item(0)?.name)}</h2>
                  )}
                  <p>Total size: {formatFileSize(totalSize)}</p>

                  {room && room.user_count > 1 && (
                    <div className="alert alert-success">
                      <CheckCircle className="h-5 w-5" />
                      <span>Receiver connected!</span>
                    </div>
                  )}

                  <div className="flex flex-row gap-2 items-center justify-center pt-5">
                    <input
                      disabled={link === 'loading...'}
                      className={`input input-bordered ${link === 'loading...' ? 'animate-pulse' : ''}`}
                      value={link}
                      readOnly
                    />
                    <QrButton disabled={link === 'loading...'} link={link} />
                    <LinkButton disabled={link === 'loading...'} link={link} />
                  </div>

                  {isTransferring && (
                    <ProgressBar
                      progress={uploadProgress}
                      fileName={filesToSend.length === 1 ? filesToSend.item(0)?.name : undefined}
                      isUploading={true}
                    />
                  )}

                  <p className="text-wrap pt-3 font-bold">⚠️ Make sure to keep this page open whilst sending!</p>
                  <p className="text-wrap pt-2">
                    Share the link or scan the QR code to start downloading the file on another device.
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <label htmlFor="change-files" className="btn btn-neutral w-full">
                    <Upload className="h-5 w-5" />
                    Change upload
                  </label>
                  <input onChange={handleFiles} className="hidden" id="change-files" type="file" multiple />
                  <button onClick={cancelUpload} className="btn w-full">
                    <X className="h-5 w-5" />
                    Cancel upload
                  </button>
                </div>
              </div>
            )}
          </div>
        </label>
        <input onChange={handleFiles} className="hidden" id="files" type="file" disabled={!!(filesToSend && filesToSend?.length > 0)} multiple />

        {!filesToSend && (
          <div className="card card-bordered card-compact bg-base-100 w-96">
            <div className="card-body">
              <h3 className="font-semibold text-lg mb-2">Or receive files</h3>
              {showReceiveInput ? (
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="Paste share link here..."
                    className="input input-bordered w-full"
                    value={receiveLinkInput}
                    onChange={(e) => setReceiveLinkInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleReceiveLinkSubmit()
                      }
                    }}
                  />
                  <div className="flex gap-2">
                    <button onClick={handleReceiveLinkSubmit} className="btn btn-primary flex-1">
                      Join
                    </button>
                    <button onClick={handleReceiveClick} className="btn btn-neutral">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={handleReceiveClick} className="btn btn-neutral btn-wide">
                  <Download className="h-5 w-5" />
                  Receive file(s)
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex sm:hidden flex-col gap-4">
        <label htmlFor="files-mobile" className="btn btn-primary btn-wide">
          <Upload />
          Send file(s)
        </label>
        <input onChange={handleFiles} className="hidden" id="files-mobile" type="file" disabled={!!(filesToSend && filesToSend?.length > 0)} multiple />

        {!filesToSend && (
          <button onClick={handleReceiveClick} className="btn btn-neutral btn-wide">
            <Download className="h-5 w-5" />
            Receive file(s)
          </button>
        )}
      </div>

      {showReceiveInput && !filesToSend && (
        <div className="modal modal-open flex sm:hidden justify-center content-center z-50">
          <div className="modal-box">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={handleReceiveClick}>
              <X className="h-4 w-4" />
            </button>
            <h3 className="font-bold text-lg mb-4">Enter Share Link</h3>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Paste share link here..."
                className="input input-bordered w-full"
                value={receiveLinkInput}
                onChange={(e) => setReceiveLinkInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleReceiveLinkSubmit()
                  }
                }}
              />
              <button onClick={handleReceiveLinkSubmit} className="btn btn-primary w-full">
                Join
              </button>
            </div>
          </div>
        </div>
      )}

      {filesToSend && filesToSend.length > 0 && (
        <div className="modal modal-open flex sm:hidden justify-center content-center z-50">
          <div className="modal-box card card-bordered card-compact bg-base-100">
            <button className="self-end" onClick={cancelUpload} aria-label="close menu and cancel">
              <X className="h-5 w-5" />
            </button>
            <div className="flex flex-col gap-6">
              <div className="text-left space-y-4">
                {filesToSend.length > 1 ? (
                  <h2 className="text-xl font-semibold">Multiple files ({filesToSend.length})</h2>
                ) : (
                  <h2 className="text-xl font-semibold text-wrap">{truncateFileName(filesToSend.item(0)?.name)}</h2>
                )}
                <p>Total size: {formatFileSize(totalSize)}</p>

                {room && room.user_count > 1 && (
                  <div className="alert alert-success">
                    <CheckCircle className="h-5 w-5" />
                    <span>Receiver connected!</span>
                  </div>
                )}

                <div className="flex flex-row gap-2 items-center justify-center pt-5">
                  <input
                    disabled={link === 'loading...'}
                    className={`input input-bordered w-full ${link === 'loading...' ? 'animate-pulse' : ''}`}
                    value={link}
                    readOnly
                  />
                  <ShareButton disabled={link === 'loading...'} link={link} />
                </div>

                {isTransferring && (
                  <ProgressBar
                    progress={uploadProgress}
                    fileName={filesToSend.length === 1 ? filesToSend.item(0)?.name : undefined}
                    isUploading={true}
                  />
                )}

                <p className="text-wrap pt-3 font-bold">⚠️ Make sure to keep this page open whilst sending! ⚠️</p>
                <p className="text-wrap pt-2">
                  Share the link or scan the QR code to start downloading the file on another device.
                </p>
                <div className="flex justify-center">
                  <QRCodeSVG value={link} size={128} />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <label htmlFor="change-files-mobile" className="btn btn-neutral w-full">
                  <Upload className="h-5 w-5" />
                  Change upload
                </label>
                <input onChange={handleFiles} className="hidden" id="change-files-mobile" type="file" multiple />
                <button onClick={cancelUpload} className="btn w-full">
                  <X className="h-5 w-5" />
                  Cancel upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
