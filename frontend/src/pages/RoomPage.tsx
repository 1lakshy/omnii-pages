import { useParams } from 'react-router-dom'
import FileReceiver from '@/components/FileReceiver'
import GradientBackdrop from '@/components/GradientBackdrop'

export default function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>()

  return (
    <section className="md:min-h-[100vh] bg-base-100 relative overflow-hidden">
      <GradientBackdrop />
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center justify-center gap-16 lg:gap-20 px-8 py-12 lg:py-32">
        <FileReceiver roomId={roomId} />
      </div>
    </section>
  )
}
