import { Share2 } from 'lucide-react'
import { useToastStore } from '@/stores/useToastStore'
import { ToastType } from '@/types/toast'

interface ShareButtonProps {
  link: string
  disabled?: boolean
}

export default function ShareButton({ link, disabled = false }: ShareButtonProps) {
  const { addToast } = useToastStore()

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link)
    console.log("Copied to clipboard")
    addToast({
      type: ToastType.Success,
      title: "Copied to clipboard",
      description: "The link has been copied to your clipboard"
    })
  }

  const shareLink = () => {
    if (!navigator.share) {
      console.error("Web Share API not supported")
      copyToClipboard()
      return
    }
    navigator.share({
      title: "Share the link",
      text: "Share the link with your friends",
      url: link,
    })
  }

  return (
    <div className="tooltip tooltip-bottom" data-tip="Share link">
      <button disabled={disabled} onClick={shareLink} className="btn btn-square bg-base-100">
        <Share2 />
      </button>
    </div>
  )
}
