// jest.setup.ts
import '@testing-library/jest-dom'
import 'whatwg-fetch'
import { TextEncoder, TextDecoder } from 'util'
import { NextResponse } from 'next/server'

process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/librakeeper'

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder as any

// Mock NextResponse.json specifically
NextResponse.json = (data: any, init?: ResponseInit) => {
  const res = new NextResponse(JSON.stringify(data), init)
  res.headers.set('Content-Type', 'application/json')
  // @ts-ignore
  res._json = data
  return res
}

// @ts-ignore
Response.prototype.json = async function() {
  if (this._json) return this._json
  const text = await this.text()
  return text ? JSON.parse(text) : {}
}

jest.mock('@auth/prisma-adapter', () => ({
  PrismaAdapter: jest.fn(),
}))
