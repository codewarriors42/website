import { TRPCError } from '@trpc/server'
import type { TRPCRouterRecord } from '@trpc/server'

import {
  protectedProcedure,
  publicProcedure,
} from '../../integrations/trpc/init'
import { Member } from '../db/schemas/member'
import { memberDBSchema } from '#/types/schemas/member.schema'
import z from 'zod'

export const membersRouter = {
  getAll: publicProcedure.query(async () => {
    const members = await Member.find()
    return members
  }),
  addMember: protectedProcedure
    .input(memberDBSchema)
    .mutation(async ({ input }) => {
      const inputData = await memberDBSchema.safeParseAsync(input)
      if (!inputData.success) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid input' })
      }
      const { name, grade, roles, image, socials } = inputData.data
      const cleanedSocials = socials.filter(
        (social) => social.url.trim().length > 0,
      )
      try {
        await Member.insertOne({
          name,
          grade,
          roles,
          image,
          socials: cleanedSocials,
        })
      } catch {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to add member',
        })
      }
      return { message: 'Member added successfully', is_success: true }
    }),
  getSingleMemberByID: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        const member = await Member.findById(input.id)
        if (!member) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Member not found',
          })
        }
        return member
      } catch (err) {
        if (err instanceof TRPCError) {
          throw err
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch member',
        })
      }
    }),
  updateMember: protectedProcedure
    .input(memberDBSchema.merge(z.object({ id: z.string() })))
    .mutation(async ({ input }) => {
      const updateSchema = memberDBSchema.merge(z.object({ id: z.string() }))
      const inputData = await updateSchema.safeParseAsync(input)
      if (!inputData.success) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid input' })
      }
      const { name, grade, roles, image, socials } = inputData.data
      const cleanedSocials = socials.filter(
        (social) => social.url.trim().length > 0,
      )
      try {
        await Member.updateOne(
          { _id: input.id },
          {
            $set: {
              name,
              grade,
              roles,
              image,
              socials: cleanedSocials,
            },
          },
        )
      } catch {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update member',
        })
      }
      return { message: 'Member updated successfully', is_success: true }
    }),
  deleteMember: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await Member.deleteOne({ _id: input.id })
      } catch {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete member',
        })
      }
      return { message: 'Member deleted successfully', is_success: true }
    }),
} satisfies TRPCRouterRecord
