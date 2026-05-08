import { protectedProcedure, publicProcedure } from '#/integrations/trpc/init'
import { addUserSchema, loginSchema } from '#/types/schemas/auth.schema'
import { User } from '../db/schemas/user'
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
  addUser: publicProcedure
    .input(addUserSchema)
    .mutation(async ({ input }): Promise<AuthResponse> => {
      const user_input = addUserSchema.safeParse(input)
      if (!user_input.success) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid input' })
      }

      const { username, name, password, isSupreme } = user_input.data

      const get_user = await User.findOne({ username }).exec()
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
      const new_user = new User({
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

      const get_user = await User.findOne({ username }).exec()
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
}
