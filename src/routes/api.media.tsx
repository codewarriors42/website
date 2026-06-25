import { connectDB } from '@/server/db'
import { createFileRoute } from '@tanstack/react-router'
import mongoose from 'mongoose'
import { Readable } from 'node:stream'

let cachedBucket: mongoose.mongo.GridFSBucket | null = null
let cachedDb: mongoose.Connection['db'] | null = null

async function getGridFSBucket() {
  const connection = await connectDB()
  const db = connection.connection.db

  if (!db) throw new Error('MongoDB not ready')

  if (cachedBucket && cachedDb === db) {
    return cachedBucket
  }

  cachedBucket = new mongoose.mongo.GridFSBucket(db, {
    bucketName: 'fs',
  })

  cachedDb = db
  return cachedBucket
}

/* -------------------------
   POST - Upload file (STREAMING)
--------------------------*/
async function handlerPOST({ request }: { request: Request }) {
  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return new Response('No file uploaded', { status: 400 })
  }

  if (!file.type.startsWith('image/')) {
    return new Response('Only images allowed', { status: 400 })
  }

  if (file.size > 5 * 1024 * 1024) {
    return new Response('File too large (max 5MB)', { status: 413 })
  }

  const bucket = await getGridFSBucket()

  const filename = `avatar-${Date.now()}-${Math.random().toString(36).slice(2)}.${file.name.split('.').pop()}`

  const uploadStream = bucket.openUploadStream(filename, {
    metadata: {
      originalName: file.name,
      mediaType: file.type,
    },
  })

  const uploadPromise = new Promise<{ fileId: any }>((resolve, reject) => {
    uploadStream.once('finish', () => {
      resolve({ fileId: uploadStream.id })
    })
    uploadStream.once('error', reject)
  })

  const nodeStream = Readable.fromWeb(file.stream() as any)
  nodeStream.pipe(uploadStream)

  const result = await uploadPromise

  return new Response(JSON.stringify(result), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  })
}

/* -------------------------
   GET - Download by fileId
--------------------------*/
async function handlerGET({ request }: { request: Request }) {
  const url = new URL(request.url)
  const fileId = url.searchParams.get('fileId')

  if (!fileId) {
    return new Response('Missing fileId', { status: 400 })
  }

  const bucket = await getGridFSBucket()

  try {
    const stream = bucket.openDownloadStream(
      new mongoose.Types.ObjectId(fileId),
    )

    return new Response(Readable.toWeb(stream) as any, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000',
      },
    })
  } catch {
    return new Response('File not found', { status: 404 })
  }
}

/* -------------------------
   DELETE - Remove by fileId
--------------------------*/
async function handlerDELETE({ request }: { request: Request }) {
  const url = new URL(request.url)
  const fileId = url.searchParams.get('fileId')

  if (!fileId) {
    return new Response('Missing fileId', { status: 400 })
  }

  const bucket = await getGridFSBucket()

  try {
    await bucket.delete(new mongoose.Types.ObjectId(fileId))
    return new Response(null, { status: 204 })
  } catch {
    return new Response('File not found', { status: 404 })
  }
}

/* -------------------------
   ROUTE EXPORT
--------------------------*/
export const Route = createFileRoute('/api/media')({
  server: {
    handlers: {
      GET: handlerGET,
      POST: handlerPOST,
      DELETE: handlerDELETE,
    },
  },
})
