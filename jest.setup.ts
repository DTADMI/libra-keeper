// jest.setup.ts
import "@testing-library/jest-dom";
import "whatwg-fetch";

import { NextResponse } from "next/server";
import { TextDecoder, TextEncoder } from "util";

process.env.DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/librakeeper";
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";

// Extend the global type to include our custom properties
declare global {
  interface Response {
    _json?: unknown;
  }
}

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof globalThis.TextDecoder;

// Mock NextResponse.json specifically
// @ts-expect-error - Next.js 15+ types are stricter for static methods
NextResponse.json = <T>(data: T, init?: ResponseInit): NextResponse => {
  const response = new NextResponse(JSON.stringify(data), init);
  response.headers.set("Content-Type", "application/json");
  response._json = data;
  return response;
};

// Extend Response prototype for testing
Response.prototype.json = async function <T>(): Promise<T> {
  if (this._json) {
    return this._json as T;
  }
  const text = await this.text();
  return text ? JSON.parse(text) : ({} as T);
};
