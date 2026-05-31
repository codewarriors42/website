import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'
import { useState } from 'react'
import { CircleNotchIcon } from '@phosphor-icons/react'

export interface AdminUserFormValues {
  id?: string
  username: string
  name: string
  password?: string
  isSupreme?: boolean
}

interface AdminUserFormProps {
  initialData?: AdminUserFormValues
  onSubmit: (data: any) => void | Promise<void>
  submitLabel?: string
  isEditForm?: boolean
  isPending?: boolean
}

export function AdminUserForm({
  initialData,
  onSubmit,
  submitLabel = 'Save',
  isEditForm = false,
  isPending = false,
}: AdminUserFormProps) {
  const [inputState, setInputState] = useState<AdminUserFormValues>(
    initialData || {
      username: '',
      name: '',
      password: '',
      isSupreme: true,
    },
  )

  const handleReset = () => {
    setInputState(
      initialData || { username: '', name: '', password: '', isSupreme: true },
    )
  }

  return (
    <form
      className="grid gap-3 max-w-md w-full mx-auto px-4 sm:px-0"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(inputState)
        if (!initialData) handleReset()
      }}
    >
      <div className="grid gap-2 pb-4">
        <label htmlFor="admin-name" className="text-md text-muted-foreground">
          Name
        </label>
        <Input
          id="admin-name"
          name="name"
          placeholder="Full name"
          value={inputState.name}
          onChange={(e) => {
            const val = e.currentTarget.value
            setInputState((prev) => ({ ...prev, name: val }))
          }}
          className="rounded-none px-3 py-4 w-full"
        />
      </div>

      <div className="grid gap-2 pb-4">
        <label
          htmlFor="admin-username"
          className="text-md text-muted-foreground"
        >
          Username
        </label>
        <Input
          id="admin-username"
          name="username"
          placeholder="username"
          value={inputState.username}
          onChange={(e) => {
            const val = e.currentTarget.value
            setInputState((prev) => ({ ...prev, username: val }))
          }}
          className="rounded-none px-3 py-4 w-full"
        />
      </div>

      <div className="grid gap-2 pb-4">
        <label
          htmlFor="admin-password"
          className="text-md text-muted-foreground"
        >
          Password
        </label>
        <Input
          id="admin-password"
          name="password"
          type="password"
          placeholder={
            isEditForm ? 'Leave blank to keep current password' : 'Password'
          }
          value={inputState.password || ''}
          onChange={(e) => {
            const val = e.currentTarget.value
            setInputState((prev) => ({ ...prev, password: val }))
          }}
          className="rounded-none px-3 py-4 w-full"
        />
      </div>

      {/* isSupreme is set to true by default and not editable via form */}

      <div className="mt-4 pb-6 flex flex-col sm:flex-row items-center justify-center gap-4 mx-auto w-full max-w-lg">
        <Button
          type="button"
          onClick={() => handleReset()}
          variant="outline"
          className="rounded-none cursor-pointer w-full sm:w-1/2 h-10 py-2 text-sm"
        >
          Reset
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="rounded-none w-full sm:w-1/2 h-10 py-2 text-sm"
        >
          {isPending ? (
            <CircleNotchIcon size={20} className="animate-spin" />
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  )
}

export default AdminUserForm
