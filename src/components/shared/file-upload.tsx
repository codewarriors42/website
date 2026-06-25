import { Upload } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'

interface FileUploadButtonProps {
  file: File | null
  previewUrl?: string | null
  onFileSelect: (file: File | null) => void
}

export function FileUploadButton({
  file,
  previewUrl,
  onFileSelect,
}: FileUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null
    onFileSelect(selectedFile)
    e.currentTarget.value = ''
  }

  // sync preview whenever file changes (controlled source of truth)
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file)
      setPreview(url)
      return () => URL.revokeObjectURL(url)
    }
    setPreview(previewUrl ?? null)
  }, [file, previewUrl])

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />

      {preview ? (
        <div className="flex items-center gap-4 border-2 rounded-lg px-5 border-dotted">
          <img
            src={preview}
            alt="preview"
            className="h-14 w-14 object-cover border"
          />

          <div className="flex-1 min-w-0">
            <p className="font-medium truncate text-xs line-clamp-1">
              {!file?.name && previewUrl ? 'current_profile.png' : file?.name}
            </p>

            <p className="text-xs text-muted-foreground">
              {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : ''}
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClick}
          >
            Change
          </Button>
        </div>
      ) : (
        <Button type="button" variant="secondary" onClick={handleClick}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Image
        </Button>
      )}
    </div>
  )
}
