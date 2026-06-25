export async function uploadFile(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch('/api/media', {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) throw new Error('Upload failed')

  return (await res.json()) as { fileId: string }
}

export function getMediaUrl(fileId: string | null) {
  if (!fileId) return null
  return `/api/media?fileId=${encodeURIComponent(fileId)}`
}

export async function deleteFile(fileId: string) {
  const res = await fetch(`/api/media?fileId=${fileId}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    const message = await res.text()
    throw new Error(message)
  }

  return true
}
