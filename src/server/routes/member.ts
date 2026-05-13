import { TRPCError } from '@trpc/server'
import type { TRPCRouterRecord } from '@trpc/server'

import {
  protectedProcedure,
  publicProcedure,
} from '../../integrations/trpc/init'
import { MemberModel } from '../db/schemas/member'
import { memberDBSchema } from '#/types/schemas/member.schema'
import z from 'zod'
import { Alumin } from '../db/schemas/alumni'

export const membersRouter = {
  getAll: publicProcedure.query(async () => {
    try {
      const members = await MemberModel.find()
      return members
    } catch {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch members',
      })
    }
  }),
  create: protectedProcedure
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
        await MemberModel.insertOne({
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
        const member = await MemberModel.findById(input.id)
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
  update: protectedProcedure
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
        await MemberModel.updateOne(
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
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await MemberModel.deleteOne({ _id: input.id })
      } catch {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete member',
        })
      }
      return { message: 'Member deleted successfully', is_success: true }
    }),
  moveToAlumni: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const member = await MemberModel.findById(input.id)
        if (!member) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Member not found',
          })
        }
        await Alumin.insertOne({
          name: member.name,
          year: new Date().getFullYear(),
          post: member.roles,
          current: '',
          socials: member.socials,
          image: member.image,
        })
        await MemberModel.deleteOne({ _id: input.id })
      } catch (err) {
        if (err instanceof TRPCError) {
          throw err
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to move member to alumni',
        })
      }
      return {
        message: 'Member moved to alumni successfully',
        is_success: true,
      }
    }),
} satisfies TRPCRouterRecord
