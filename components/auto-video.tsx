export function AutoVideo({ src, poster, className = '' }: { src: string; poster?: string; className?: string }) {
  return (
    <div className={`media-frame ${className}`}>
      <video autoPlay muted loop playsInline poster={poster} className="h-full w-full object-cover">
        <source src={src} />
      </video>
    </div>
  )
}
