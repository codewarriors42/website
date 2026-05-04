import { z } from 'zod'

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .max(255, 'Username must be less than 255 characters'),
  password: z
    .string()
    .min(1, 'Password is required')
    .max(255, 'Password must be less than 255 characters'),
})

export const addUserSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .max(255, 'Username must be less than 255 characters'),
  password: z
    .string()
    .min(1, 'Password is required')
    .max(255, 'Password must be less than 255 characters'),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must be less than 255 characters'),
  isSupreme: z.boolean().default(true),
})

export type LoginInput = z.infer<typeof loginSchema>
export type AddUserInput = z.infer<typeof addUserSchema>
