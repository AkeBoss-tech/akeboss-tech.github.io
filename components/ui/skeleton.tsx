'use client'

import { cn } from '@/lib/utils'

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-white/[0.03] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]',
        className
      )}
      {...props}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="panel-soft flex h-full flex-col rounded-[32px] p-6 sm:p-8">
      <Skeleton className="aspect-video w-full rounded-2xl" />
      <div className="mt-6 flex flex-wrap gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <Skeleton className="mt-6 h-10 w-3/4 rounded-lg" />
      <Skeleton className="mt-4 h-20 w-full rounded-lg" />
      <div className="mt-auto pt-8">
        <Skeleton className="h-6 w-32 rounded-full" />
      </div>
    </div>
  )
}
