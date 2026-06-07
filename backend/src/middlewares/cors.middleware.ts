import type { RequestHandler } from 'express'

const allowedOrigins = new Set([
  'http://localhost:5173',
  'http://127.0.0.1:5173',
])

function getAllowedOrigin(origin: string | undefined): string {
  if (!origin || origin === 'null') {
    return '*'
  }

  return allowedOrigins.has(origin) ? origin : 'http://localhost:5173'
}

export const corsMiddleware: RequestHandler = (request, response, next) => {
  response.setHeader(
    'Access-Control-Allow-Origin',
    getAllowedOrigin(request.headers.origin),
  )
  response.setHeader('Vary', 'Origin')
  response.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE')
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (request.method === 'OPTIONS') {
    response.sendStatus(204)
    return
  }

  next()
}
