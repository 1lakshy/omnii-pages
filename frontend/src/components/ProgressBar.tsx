interface ProgressBarProps {
  progress: number
  fileName?: string
  isUploading?: boolean
}

export default function ProgressBar({ progress, fileName, isUploading = false }: ProgressBarProps) {
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium">
          {isUploading ? 'Uploading' : 'Downloading'} {fileName && `- ${fileName}`}
        </span>
        <span className="text-base-content/70">{progress}%</span>
      </div>
      <div className="w-full bg-base-300 rounded-full h-2.5">
        <div
          className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
