import { Link } from 'lucide-react'
import { useToastStore } from '@/stores/useToastStore'
import { ToastType } from '@/types/toast'

interface LinkButtonProps {
  link: string
  disabled?: boolean
}

export default function LinkButton({ link, disabled = false }: LinkButtonProps) {
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

  return (
    <div className="tooltip tooltip-bottom" data-tip="Copy the link">
      <button disabled={disabled} onClick={copyToClipboard} className="btn btn-square bg-base-100">
        <Link />
      </button>
    </div>
  )
}
