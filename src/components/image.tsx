import { cn } from '#/lib/utils'

type MediaImageProps = {
  image: string
  name: string
  className?: string
}

export function MediaImage({ image, name, className }: MediaImageProps) {
  const fallbackSrc = '/default-avatar.png'
  const src = image
    ? image.startsWith('/')
      ? image
      : `/api/media?filename=${encodeURIComponent(image)}`
    : fallbackSrc

  return (
    <img
      className={cn(className)}
      src={src}
      alt={`${name}'s avatar`}
      width={100}
      height={100}
      loading="lazy"
    />
  )
}
