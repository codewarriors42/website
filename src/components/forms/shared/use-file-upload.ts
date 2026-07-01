import { useState } from 'react'
import { deleteFile, getMediaUrl, uploadFile } from '#/lib/file-uploads'

type UseFileUploadOptions = {
  initialFile?: string | null
  onSuccess?: () => void
  onError?: (error: Error) => void
}

type UseFileUploadReturn = {
  file: File | null
  setFile: (file: File | null) => void
  previewUrl: string
  isLoading: boolean
  error: Error | null
  handleUpload: () => Promise<string | null>
  reset: () => void
}

export function useFileUpload({
  initialFile,
  onSuccess,
  onError,
}: UseFileUploadOptions = {}): UseFileUploadReturn {
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const previewUrl = getMediaUrl(initialFile ?? '') ?? ''

  const handleUpload = async (): Promise<string | null> => {
    if (!file) {
      return initialFile ?? null
    }

    setIsLoading(true)
    setError(null)

    try {
      const { fileId } = await uploadFile(file)
      onSuccess?.()
      return fileId
    } catch (err) {
      const uploadError =
        err instanceof Error ? err : new Error('Upload failed')
      setError(uploadError)
      onError?.(uploadError)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const reset = () => {
    setFile(null)
    setError(null)
  }

  return {
    file,
    setFile,
    previewUrl,
    isLoading,
    error,
    handleUpload,
    reset,
  }
}
