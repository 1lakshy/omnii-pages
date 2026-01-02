import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { useToastStore } from '@/stores/useToastStore'
import { ToastType } from '@/types/toast'

interface CopyButtonProps {
  contentToCopy: string
  tooltip?: string
  subject?: string
}

export default function CopyButton({
  contentToCopy,
  tooltip = "Copy to clipboard",
  subject = "content"
}: CopyButtonProps) {
  const [hasCopied, setHasCopied] = useState(false)
  const { addToast } = useToastStore()

  const onCopy = () => {
    navigator.clipboard.writeText(contentToCopy).then(() => {
      setHasCopied(true)
      addToast({
        type: ToastType.Success,
        title: "Copied to clipboard",
        description: `The ${subject} has been copied!`
      })
      setTimeout(() => {
        setHasCopied(false)
      }, 1500)
    })
  }

  return (
    <div className="tooltip tooltip-bottom" data-tip={tooltip}>
      <button onClick={onCopy} className="btn btn-sm btn-outline btn-square">
        {hasCopied ? (
          <Check className="h-4 w-4" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
    </div>
  )
}
