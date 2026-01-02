// jest.setup.ts
import "@testing-library/jest-dom"
import "whatwg-fetch"

import { NextResponse } from "next/server"
import { TextDecoder, TextEncoder } from "util"

process.env.DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/librakeeper"

// Extend the global type to include our custom properties
declare global {
  interface Response {
    _json?: unknown;
  }
}

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder as typeof globalThis.TextDecoder

// Mock NextResponse.json specifically
NextResponse.json = <T>(data: T, init?: ResponseInit): NextResponse => {
  const response = new NextResponse(JSON.stringify(data), init)
  response.headers.set("Content-Type", "application/json")
  // @ts-expect-error - Adding custom property for testing
  response._json = data
  return response
};

// Extend Response prototype for testing
Response.prototype.json = async function <T>(): Promise<T> {
  // @ts-expect-error - Custom property for testing
  if (this._json) {
    return this._json
  }
  const text = await this.text()
  return text ? JSON.parse(text) : {} as T
}

jest.mock("@auth/prisma-adapter", () => ({
  PrismaAdapter: jest.fn(),
}));