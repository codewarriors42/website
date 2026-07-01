import type { ResourceTypeWithId } from '#/server/db/schemas/resource/resource-type'
import { AddResourceUI } from './add-resource'
import { EditResourceUI } from './edit-resource'

export function AddResourceForm() {
  return <AddResourceUI />
}

export function EditResourceForm({
  resource,
}: {
  resource: ResourceTypeWithId
}) {
  return <EditResourceUI resource={resource} />
}
