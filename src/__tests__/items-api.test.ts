import { prismaMock } from '@/lib/prisma-mock'
import { GET, POST } from '@/app/api/items/route'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

describe('Items API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('GET /api/items returns all items', async () => {
    const mockItems = [
      { id: '1', title: 'Item 1', tags: [] },
      { id: '2', title: 'Item 2', tags: [] },
    ]
    
    prismaMock.item.findMany.mockResolvedValue(mockItems as any)

    const response = await GET()
    expect(response.status).toBe(200)
    
    const data = await response.json()
    expect(data).toEqual(mockItems)
    expect(prismaMock.item.findMany).toHaveBeenCalled()
  })

  test('GET /api/items handles errors', async () => {
    prismaMock.item.findMany.mockRejectedValue(new Error('DB Error'))

    const response = await GET()
    
    expect(response.status).toBe(500)
  })

  test('POST /api/items creates an item for admin', async () => {
    const session = { user: { id: 'admin-1', role: 'ADMIN' } }
    ;(getServerSession as jest.Mock).mockResolvedValue(session)

    const newItem = {
      title: 'New Book',
      type: 'BOOK',
      tags: ['fiction']
    }

    prismaMock.item.create.mockResolvedValue({ id: 'new-id', ...newItem, tags: [{ name: 'fiction' }] } as any)

    const request = new Request('http://localhost/api/items', {
      method: 'POST',
      body: JSON.stringify(newItem)
    })

    const response = await POST(request)
    expect(response.status).toBe(200)
    
    const data = await response.json()
    expect(data.id).toBe('new-id')
    expect(prismaMock.item.create).toHaveBeenCalled()
  })

  test('POST /api/items returns 401 for non-admin', async () => {
    const session = { user: { id: 'user-1', role: 'USER' } }
    ;(getServerSession as jest.Mock).mockResolvedValue(session)

    const request = new Request('http://localhost/api/items', {
      method: 'POST',
      body: JSON.stringify({ title: 'Test' })
    })

    const response = await POST(request)
    expect(response.status).toBe(401)
  })
})
