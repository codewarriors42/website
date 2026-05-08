export async function uploadMedia(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('/api/media', {
    method: 'POST',
    body: formData,
    credentials: 'include',
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || 'Upload failed')
  }

  const data = (await response.json()) as { filename: string }
  return data.filename
}

export async function updateMedia(
  file: File,
  oldFilename: string,
): Promise<string> {
  if (
    oldFilename === '/default-avatar.png' &&
    file.name != '/default-avatar.png'
  ) {
    return await uploadMedia(file)
  }
  const formData = new FormData()
  formData.append('file', file)
  formData.append('oldFilename', oldFilename)

  const response = await fetch('/api/media', {
    method: 'PATCH',
    body: formData,
    credentials: 'include',
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || 'Update failed')
  }

  const data = (await response.json()) as { filename: string }
  return data.filename
}

export async function deleteMedia(filename: string): Promise<void> {
  if (filename === '/default-avatar.png') {
    return
  }
  const response = await fetch(
    `/api/media?filename=${encodeURIComponent(filename)}`,
    {
      method: 'DELETE',
      credentials: 'include',
    },
  )

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || 'Delete failed')
  }
}
