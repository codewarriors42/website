import { protectedProcedure, publicProcedure } from '#/integrations/trpc/init'
import { addUserSchema, loginSchema } from '#/types/schemas/auth.schema'
import { z } from 'zod'
import { UserModel } from '../db/schemas/user'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import { env } from '#/env'
import { serialize } from 'cookie'
import type { JwtPayload } from '#/types/auth/jwt'
import { TRPCError } from '@trpc/server'

type AuthResponse = {
  message: string
  is_success: boolean
}

export const authRouter = {
  create: publicProcedure
    .input(addUserSchema)
    .mutation(async ({ input }): Promise<AuthResponse> => {
      const user_input = addUserSchema.safeParse(input)
      if (!user_input.success) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid input' })
      }

      const { username, name, password, isSupreme } = user_input.data

      const get_user = await UserModel.findOne({ username }).exec()
      if (get_user) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Username already exists',
        })
      }

      let hashed_password: string
      try {
        hashed_password = await argon2.hash(password)
      } catch {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong !!',
        })
      }
      const new_user = new UserModel({
        username,
        name,
        password: hashed_password,
        isSupreme,
      })
      await new_user.save()
      return { message: 'User created successfully', is_success: true }
    }),
  login: publicProcedure
    .input(loginSchema)
    .mutation(async ({ input, ctx }): Promise<AuthResponse> => {
      const login_input = loginSchema.safeParse(input)
      if (!login_input.success) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid input' })
      }

      const { username, password } = login_input.data

      const get_user = await UserModel.findOne({ username }).exec()
      if (!get_user) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'User not found' })
      }

      const is_match = await argon2.verify(get_user.password, password)
      if (!is_match) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid username or password',
        })
      }

      const jwtPayload: JwtPayload = {
        userId: get_user._id,
        username: get_user.username,
        name: get_user.name,
      }

      let jwtToken: string
      try {
        jwtToken = jwt.sign(jwtPayload, env.ACCESS_TOKEN_SECRET, {
          expiresIn: '3d',
        })
      } catch {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Error generating token',
        })
      }

      const cookie = serialize(env.COOKIE_NAME, jwtToken, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 3, // 3 days
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      })

      ctx.resHeaders.set('Set-Cookie', cookie)

      return { message: 'Login successful', is_success: true }
    }),
  logout: protectedProcedure.mutation(async ({ ctx }) => {
    const cookie = serialize(env.COOKIE_NAME, '', {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0,
    })
    ctx.resHeaders.set('Set-Cookie', cookie)
    return { message: 'Logout successful', is_success: true }
  }),
  getSession: publicProcedure.query(async ({ ctx }) => {
    return { session: ctx.session }
  }),
  getInfo: protectedProcedure.query(async ({ ctx }) => {
    const user = await UserModel.findById(ctx.session?.userId).exec()
    if (!user) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
    }
    return {
      username: user.username,
      name: user.name,
      isSupreme: user.isSupreme,
    }
  }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const requester = await UserModel.findById(ctx.session?.userId).exec()
    if (!requester || !requester.isSupreme) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Unauthorized' })
    }

    const users = await UserModel.find()
      .select('_id username name isSupreme createdAt')
      .exec()

    return users
  }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        username: z.string().optional(),
        name: z.string().optional(),
        password: z.string().optional(),
        isSupreme: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input, ctx }): Promise<AuthResponse> => {
      const requester = await UserModel.findById(ctx.session?.userId).exec()
      if (!requester || !requester.isSupreme) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Unauthorized' })
      }

      const { id, username, name, password, isSupreme } = input
      const user = await UserModel.findById(id).exec()
      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
      }

      if (username && username !== user.username) {
        const exists = await UserModel.findOne({ username }).exec()
        if (exists) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Username already exists',
          })
        }
        user.username = username
      }

      if (typeof name !== 'undefined') user.name = name
      if (typeof isSupreme !== 'undefined') user.isSupreme = isSupreme

      if (password) {
        try {
          user.password = await argon2.hash(password)
        } catch {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to hash password',
          })
        }
      }

      await user.save()
      return { message: 'User updated successfully', is_success: true }
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }): Promise<AuthResponse> => {
      const requester = await UserModel.findById(ctx.session?.userId).exec()
      if (!requester || !requester.isSupreme) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Unauthorized' })
      }

      const user = await UserModel.findById(input.id).exec()
      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
      }

      await UserModel.deleteOne({ _id: input.id }).exec()
      return { message: 'User deleted successfully', is_success: true }
    }),
}
