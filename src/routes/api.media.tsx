import { connectDB } from '#/server/db'
import { createFileRoute } from '@tanstack/react-router'
import mongoose from 'mongoose'
import { Readable } from 'node:stream'

function generateMediaFilename(originalName: string): string {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
  const ext = originalName.split('.').pop() || ''
  return `avatar-${uniqueSuffix}.${ext}`
}

let cachedBucket: mongoose.mongo.GridFSBucket | null = null
let cachedDb: mongoose.Connection['db'] | null = null

async function getGridFSBucket() {
  const connection = await connectDB()
  const db = connection.connection.db
  if (!db) {
    throw new Error('MongoDB connection is not ready')
  }
  if (cachedBucket && cachedDb === db) {
    return cachedBucket
  }
  cachedBucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'fs' })
  cachedDb = db
  return cachedBucket
}

async function handlerGET({ request }: { request: Request }) {
  try {
    const url = new URL(request.url)
    const filename = url.searchParams.get('filename')
    if (!filename) {
      return new Response('Missing filename', {
        status: 400,
        headers: {
          'Content-Type': 'text/plain',
        },
      })
    }
    const bucket = await getGridFSBucket()
    const db = cachedDb
    if (!db) {
      throw new Error('MongoDB connection is not ready')
    }
    const fileDoc = await db.collection('fs.files').findOne({ filename })
    if (!fileDoc) {
      return new Response('Image not found', {
        status: 404,
        headers: {
          'Content-Type': 'text/plain',
        },
      })
    }
    const downloadStream = bucket.openDownloadStreamByName(filename)
    const webStream = Readable.toWeb(
      downloadStream,
    ) as unknown as ReadableStream
    return new Response(webStream, {
      status: 200,
      headers: {
        'Content-Type': fileDoc.contentType ?? 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000',
      },
    })
  } catch (error) {
    console.error('Error handling GET request at /api/media:', error)
    return new Response('Internal Server Error', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  }
}

async function handlerPOST({ request }: { request: Request }) {
  const formData = await request.formData()
  const file = formData.get('file') as File | null
  if (!file) {
    return new Response('No file uploaded', {
      status: 400,
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  }
  const filename = generateMediaFilename(file.name)
  const bucket = await getGridFSBucket()
  const uploadStream = bucket.openUploadStream(filename, {
    metadata: {
      originalName: file.name,
      mediaType: file.type,
      filename,
    },
  })
  const buffer = await file.arrayBuffer()
  uploadStream.end(Buffer.from(buffer))

  await new Promise<void>((resolve, reject) => {
    uploadStream.on('finish', () => resolve())
    uploadStream.on('error', reject)
  })

  return new Response(JSON.stringify({ filename }), {
    status: 201,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

async function handlerPATCH({ request }: { request: Request }) {
  const formData = await request.formData()
  const file = formData.get('file') as File | null
  const oldFilename = formData.get('oldFilename')
  if (!file) {
    return new Response('No file uploaded', {
      status: 400,
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  }
  const filename = generateMediaFilename(file.name)
  const bucket = await getGridFSBucket()
  if (typeof oldFilename === 'string' && oldFilename.trim().length > 0) {
    const db = cachedDb
    if (!db) {
      return new Response('MongoDB connection is not ready', {
        status: 500,
        headers: {
          'Content-Type': 'text/plain',
        },
      })
    }
    const oldDoc = await db.collection('fs.files').findOne({
      filename: oldFilename,
    })
    if (oldDoc?._id) {
      await bucket.delete(oldDoc._id)
    }
  }

  const uploadStream = bucket.openUploadStream(filename, {
    metadata: {
      originalName: file.name,
      mediaType: file.type,
      filename,
    },
  })
  const buffer = await file.arrayBuffer()
  uploadStream.end(Buffer.from(buffer))

  await new Promise<void>((resolve, reject) => {
    uploadStream.on('finish', () => resolve())
    uploadStream.on('error', reject)
  })

  return new Response(JSON.stringify({ filename }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

async function handlerDELETE({ request }: { request: Request }) {
  const url = new URL(request.url)
  const filename = url.searchParams.get('filename')

  if (!filename) {
    return new Response('Missing filename', {
      status: 400,
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  }

  const bucket = await getGridFSBucket()
  const db = cachedDb
  if (!db) {
    return new Response('MongoDB connection is not ready', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  }

  const fileDoc = await db.collection('fs.files').findOne({ filename })
  if (!fileDoc?._id) {
    return new Response('File not found', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  }

  await bucket.delete(fileDoc._id)

  return new Response(null, { status: 204 })
}

export const Route = createFileRoute('/api/media')({
  server: {
    handlers: {
      GET: handlerGET,
      POST: handlerPOST,
      PATCH: handlerPATCH,
      DELETE: handlerDELETE,
    },
  },
})
