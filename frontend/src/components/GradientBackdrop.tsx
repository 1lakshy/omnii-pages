export default function GradientBackdrop() {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4">
      <div className="w-full h-full bg-gradient-to-br from-red-200 via-red-300 to-red-400 opacity-20 blur-3xl rounded-full"></div>
    </div>
  )
}
