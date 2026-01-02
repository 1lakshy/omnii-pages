import { create } from 'zustand'
import { FileOffer } from '@/types/file'

interface FileStore {
  filesUploaded: FileList | null
  incomingFileOffers: FileOffer[]
  currentFileOffer: FileOffer | null
  offeredFiles: Map<string, FileList>
  downloadFinished: boolean
  uploadProgress: number
  downloadProgress: number
  isTransferring: boolean

  setFilesUploaded: (files: FileList | null) => void
  addIncomingFileOffer: (offer: FileOffer) => void
  setCurrentFileOffer: (offer: FileOffer | null) => void
  nextFileOffer: () => void
  addOfferedFiles: (id: string, files: FileList) => void
  setDownloadFinished: (finished: boolean) => void
  updateCurrentFileOffer: (offer: FileOffer) => void
  setUploadProgress: (progress: number) => void
  setDownloadProgress: (progress: number) => void
  setIsTransferring: (transferring: boolean) => void
}

export const useFileStore = create<FileStore>((set) => ({
  filesUploaded: null,
  incomingFileOffers: [],
  currentFileOffer: null,
  offeredFiles: new Map(),
  downloadFinished: false,
  uploadProgress: 0,
  downloadProgress: 0,
  isTransferring: false,

  setFilesUploaded: (files) => set({ filesUploaded: files }),
  
  addIncomingFileOffer: (offer) => {
    console.log("Adding incoming file offer", offer)
    set((state) => {
      const newOffers = [...state.incomingFileOffers, offer]
      return {
        incomingFileOffers: newOffers,
        currentFileOffer: state.currentFileOffer === null ? offer : state.currentFileOffer
      }
    })
  },
  
  setCurrentFileOffer: (offer) => set({ currentFileOffer: offer }),
  
  updateCurrentFileOffer: (offer) => set({ currentFileOffer: offer }),
  
  nextFileOffer: () => {
    set((state) => {
      const newOffers = state.incomingFileOffers.slice(1)
      if (newOffers.length > 0) {
        return {
          incomingFileOffers: newOffers,
          currentFileOffer: newOffers[0]
        }
      } else {
        return {
          incomingFileOffers: [],
          currentFileOffer: null,
          downloadFinished: true
        }
      }
    })
  },
  
  addOfferedFiles: (id, files) => {
    set((state) => {
      const newMap = new Map(state.offeredFiles)
      newMap.set(id, files)
      return { offeredFiles: newMap }
    })
  },

  setDownloadFinished: (finished) => set({ downloadFinished: finished }),

  setUploadProgress: (progress) => set({ uploadProgress: progress }),

  setDownloadProgress: (progress) => set({ downloadProgress: progress }),

  setIsTransferring: (transferring) => set({ isTransferring: transferring }),
}))
