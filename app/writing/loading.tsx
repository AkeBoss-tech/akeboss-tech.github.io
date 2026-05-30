import { CardSkeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="container-wide py-10 sm:py-14">
      <section className="max-w-4xl animate-pulse">
        <div className="h-20 w-3/4 rounded-2xl bg-white/[0.03]" />
        <div className="mt-4 h-6 w-1/2 rounded-full bg-white/[0.02]" />
      </section>

      <div className="mt-12 space-y-12">
        {Array.from({ length: 2 }).map((_, i) => (
          <section key={i}>
            <div className="mb-6 h-6 w-32 rounded-full bg-white/[0.03]" />
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, j) => (
                <CardSkeleton key={j} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
