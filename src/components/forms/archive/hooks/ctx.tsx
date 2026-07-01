import type { ArchiveEventType } from '#/constants/events'
import type {
  ArchiveCategory,
  ArchiveLink,
  ArchivePlatformType,
  ArchiveTypeWithId,
} from '#/server/db/schemas/archive/archive-type'
import { createContext, useContext, useState } from 'react'

interface ArchiveFormContextType {
  title: string
  setTitle: React.Dispatch<React.SetStateAction<string>>
  competition: string
  setCompetition: React.Dispatch<React.SetStateAction<string>>
  category: ArchiveCategory
  setCategory: React.Dispatch<React.SetStateAction<ArchiveCategory>>
  event: ArchiveEventType
  setEvent: React.Dispatch<React.SetStateAction<ArchiveEventType>>
  contributors: string[]
  setContributors: React.Dispatch<React.SetStateAction<string[]>>
  year: number
  setYear: React.Dispatch<React.SetStateAction<number>>
  socials: ArchiveLink[]
  setSocials: React.Dispatch<React.SetStateAction<ArchiveLink[]>>
  addSocial: (social: ArchiveLink) => void
  file: File | null
  setFile: React.Dispatch<React.SetStateAction<File | null>>
  removeSocial: (platform: ArchivePlatformType) => void
  addContributor: (contributor: string) => void
  removeContributor: (contributor: string) => void
  resetForm: () => void
  archiveId?: string
  previewUrl?: string
}

const ArchiveFormContext = createContext<ArchiveFormContextType | undefined>(
  undefined,
)

export function ArchiveFormProvider({
  children,
  initialData,
}: {
  initialData?: ArchiveTypeWithId
  children: React.ReactNode
}) {
  const [title, setTitle] = useState(initialData?.title ?? '')
  const [competition, setCompetition] = useState(initialData?.competition ?? '')
  const [category, setCategory] = useState<ArchiveCategory>(
    initialData?.category ?? 'creative-prompt',
  )
  const [event, setEvent] = useState<ArchiveEventType>(
    initialData?.event ?? 'Hackathon',
  )
  const [contributors, setContributors] = useState<string[]>(
    initialData?.contributors ?? [],
  )
  const [year, setYear] = useState(
    initialData?.year ?? new Date().getFullYear(),
  )
  const [socials, setSocials] = useState<ArchiveLink[]>(
    initialData?.links ?? [],
  )
  const [file, setFile] = useState<File | null>(null)

  const addSocial = (social: ArchiveLink) => {
    setSocials((prev) => [...prev, social])
  }

  const removeSocial = (platform: ArchivePlatformType) => {
    setSocials((prev) => prev.filter((social) => social.platform !== platform))
  }

  const addContributor = (contributor: string) => {
    setContributors((prev) => [...prev, contributor])
  }

  const removeContributor = (contributor: string) => {
    setContributors((prev) => prev.filter((c) => c !== contributor))
  }

  const resetForm = () => {
    setTitle('')
    setCompetition('')
    setCategory('creative-prompt')
    setEvent('Hackathon')
    setContributors([])
    setYear(new Date().getFullYear())
    setSocials([])
    setFile(null)
  }

  return (
    <ArchiveFormContext.Provider
      value={{
        title,
        setTitle,
        competition,
        setCompetition,
        category,
        setCategory,
        event,
        setEvent,
        contributors,
        setContributors,
        year,
        setYear,
        socials,
        setSocials,
        addSocial,
        removeSocial,
        resetForm,
        file,
        archiveId: initialData?.id,
        previewUrl: initialData?.image,
        setFile,
        addContributor,
        removeContributor,
      }}
    >
      {children}
    </ArchiveFormContext.Provider>
  )
}

export function useArchiveForm() {
  const ctx = useContext(ArchiveFormContext)

  if (!ctx) {
    throw new Error('useArchiveForm must be used within ArchiveFormProvider')
  }

  return ctx
}
