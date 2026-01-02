import { useRef } from 'react'
import { QrCode as QrCodeIcon } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

interface QrButtonProps {
  link: string
  disabled?: boolean
}

export default function QrButton({ link, disabled = false }: QrButtonProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  const showModal = () => {
    dialogRef.current?.showModal()
  }

  const closeModal = () => {
    dialogRef.current?.close()
  }

  return (
    <>
      <div className="tooltip tooltip-bottom" data-tip="Show QR code">
        <button disabled={disabled} className="btn btn-square bg-base-100" onClick={showModal}>
          <QrCodeIcon />
        </button>
      </div>
      <dialog ref={dialogRef} className="modal" aria-labelledby="modal-title" aria-describedby="modal-description">
        <div className="modal-box w-auto text-center flex flex-col gap-3">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              aria-label="Close dialog"
              onClick={closeModal}
            >
              ✕
            </button>
          </form>

          <p id="modal-title" className="text-2xl font-semibold">
            Scan the QR
          </p>

          <div id="modal-description">
            <div className="flex justify-center">
              <QRCodeSVG value={link} size={224} />
            </div>
            <p className="w-56 text-wrap text-center mt-4">
              Scan the QR code to start downloading the file that device.
            </p>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button aria-label="Close dialog" onClick={closeModal}>Close</button>
        </form>
      </dialog>
    </>
  )
}
