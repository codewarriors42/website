import type {
  Alumni,
  AlumniSocial,
} from '#/server/db/schemas/alumni/alumnis-type'
import type { Role } from '#/server/db/schemas/member/member-type'
import { createContext, useContext, useState } from 'react'

interface AlumniCtx {
  name: string
  setName: React.Dispatch<React.SetStateAction<string>>
  year: number
  setYear: React.Dispatch<React.SetStateAction<number>>

  post: Role[]
  setPost: React.Dispatch<React.SetStateAction<Role[]>>

  current: string
  setCurrent: React.Dispatch<React.SetStateAction<string>>

  socials: AlumniSocial[]
  setSocials: React.Dispatch<React.SetStateAction<AlumniSocial[]>>
  addSocial: (social: AlumniSocial) => void

  file: File | null
  setFile: React.Dispatch<React.SetStateAction<File | null>>

  removeSocial: (d: AlumniSocial) => void

  resetForm: () => void
  alumniId?: string
  previewUrl?: string
}

const AlumniFormContext = createContext<AlumniCtx | undefined>(undefined)

export function AlumniFormProvider({
  children,
  initialData,
}: {
  children: React.ReactNode
  initialData?: Alumni & { id: string }
}) {
  const [name, setName] = useState<string>(initialData?.name || '')
  const [year, setYear] = useState<number>(
    initialData?.year || new Date().getFullYear(),
  )
  const [post, setPost] = useState<Role[]>(initialData?.post || [])
  const [current, setCurrent] = useState<string>(initialData?.current || '')
  const [socials, setSocials] = useState<AlumniSocial[]>(
    initialData?.socials || [],
  )
  const [file, setFile] = useState<File | null>(null)

  const addSocial = (social: AlumniSocial) => {
    setSocials((prev) => [...prev, social])
  }

  const resetForm = () => {
    setName(initialData?.name || '')
    setYear(initialData?.year || new Date().getFullYear())
    setPost(initialData?.post || [])
    setCurrent(initialData?.current || '')
    setSocials(initialData?.socials || [])
    setFile(null)
  }

  const removeSocial = (social: AlumniSocial) => {
    setSocials((prev) => prev.filter((s) => s !== social))
  }

  const ctxValue: AlumniCtx = {
    name,
    setName,
    year,
    setYear,
    post,
    setPost,
    current,
    setCurrent,
    socials,
    setSocials,
    addSocial,
    alumniId: initialData?.id,
    previewUrl: initialData?.image,
    file,
    setFile,
    resetForm,
    removeSocial,
  }

  return (
    <AlumniFormContext.Provider value={ctxValue}>
      {children}
    </AlumniFormContext.Provider>
  )
}

export function useAlumniForm() {
  const context = useContext(AlumniFormContext)
  if (!context) {
    throw new Error(
      'useAlumniFormContext must be used within an AlumniFormProvider',
    )
  }
  return context
}
