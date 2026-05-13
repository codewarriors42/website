import type { ReactElement } from 'react'

type UserInfoLoaderProps = {
  count?: number
  className?: string
}

export function UserInfoLoader({
  count = 3,
  className,
}: UserInfoLoaderProps): ReactElement {
  return (
    <div className={className ?? 'grid gap-4'}>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="p-4 border border-white/10 rounded-md animate-pulse"
        >
          <div className="h-16 w-16 rounded-full bg-white/10 mb-4" />
          <div className="h-4 w-40 bg-white/10 rounded mb-2" />
          <div className="h-3 w-24 bg-white/10 rounded mb-3" />
          <div className="h-4 w-56 bg-white/10 rounded" />
        </div>
      ))}
    </div>
  )
}
