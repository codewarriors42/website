import type {
  Grade,
  MemberSocials,
  MemberType,
  Role,
} from '@/server/db/schemas/member/member-type'
import { createContext, useContext, useState } from 'react'

export type MemberSocial = {
  platform: MemberSocials
  url: string
}

interface MemberFormContextType {
  roles: Role[]
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>

  name: string
  setName: React.Dispatch<React.SetStateAction<string>>

  grade: Grade
  setGrade: React.Dispatch<React.SetStateAction<Grade>>

  socials: MemberSocial[]
  setSocials: React.Dispatch<React.SetStateAction<MemberSocial[]>>

  addSocial: (social: MemberSocial) => void

  file: File | null
  setFile: React.Dispatch<React.SetStateAction<File | null>>

  removeSocial: (platform: MemberSocials) => void

  resetForm: () => void
  memberId?: string
  previewUrl?: string
}

const MemberFormContext = createContext<MemberFormContextType | undefined>(
  undefined,
)
export function MemberFormProvider({
  children,
  initialData,
}: {
  initialData?: MemberType & { id: string }
  children: React.ReactNode
}) {
  const [roles, setRoles] = useState<Role[]>(initialData?.roles ?? [])
  const [name, setName] = useState(initialData?.name ?? '')
  const [grade, setGrade] = useState<Grade>(initialData?.grade ?? 6)
  const [socials, setSocials] = useState<MemberSocial[]>(
    initialData?.socials ?? [],
  )
  const [file, setFile] = useState<File | null>(null)

  const addSocial = (social: MemberSocial) => {
    setSocials((prev) => [...prev, social])
  }

  const resetForm = () => {
    setRoles(initialData?.roles ?? [])
    setName(initialData?.name ?? '')
    setGrade(initialData?.grade ?? 6)
    setSocials(initialData?.socials ?? [])
    setFile(null)
  }

  const removeSocial = (platform: MemberSocials) => {
    setSocials((prev) => prev.filter((s) => s.platform !== platform))
  }

  return (
    <MemberFormContext.Provider
      value={{
        roles,
        setRoles,
        name,
        setName,
        grade,
        setGrade,
        socials,
        setSocials,
        addSocial,
        file,
        removeSocial,
        setFile,
        previewUrl: initialData?.image,
        memberId: initialData?.id,
        resetForm,
      }}
    >
      {children}
    </MemberFormContext.Provider>
  )
}
export function useMemberForm() {
  const ctx = useContext(MemberFormContext)

  if (!ctx) {
    throw new Error('useMemberForm must be used inside MemberFormProvider')
  }

  return ctx
}
