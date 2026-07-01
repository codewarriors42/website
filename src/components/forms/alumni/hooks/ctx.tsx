import type {
  Alumni,
  AlumniSocial,
} from '#/server/db/schemas/alumni/alumnis-type'
import type { Role } from '#/server/db/schemas/member/member-type'
import { createContext, useContext, useState } from 'react'

interface AlumniFormContextType {
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
  removeSocial: (social: AlumniSocial) => void
  resetForm: () => void
  alumniId?: string
  previewUrl?: string
}

const AlumniFormContext = createContext<AlumniFormContextType | undefined>(
  undefined,
)

export function AlumniFormProvider({
  children,
  initialData,
}: {
  children: React.ReactNode
  initialData?: Alumni & { id: string }
}) {
  const [name, setName] = useState(initialData?.name ?? '')
  const [year, setYear] = useState(
    initialData?.year ?? new Date().getFullYear(),
  )
  const [post, setPost] = useState<Role[]>(initialData?.post ?? [])
  const [current, setCurrent] = useState(initialData?.current ?? '')
  const [socials, setSocials] = useState<AlumniSocial[]>(
    initialData?.socials ?? [],
  )
  const [file, setFile] = useState<File | null>(null)

  const addSocial = (social: AlumniSocial) => {
    setSocials((prev) => [...prev, social])
  }

  const resetForm = () => {
    setName(initialData?.name ?? '')
    setYear(initialData?.year ?? new Date().getFullYear())
    setPost(initialData?.post ?? [])
    setCurrent(initialData?.current ?? '')
    setSocials(initialData?.socials ?? [])
    setFile(null)
  }

  const removeSocial = (social: AlumniSocial) => {
    setSocials((prev) => prev.filter((s) => s !== social))
  }

  const ctxValue: AlumniFormContextType = {
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
    file,
    setFile,
    resetForm,
    removeSocial,
    alumniId: initialData?.id,
    previewUrl: initialData?.image,
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
    throw new Error('useAlumniForm must be used within AlumniFormProvider')
  }
  return context
}
