jest.mock("@/lib/db", () => ({
  prisma: {
    item: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock("@/lib/redis", () => ({
  redis: {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue("OK"),
    pipeline: jest.fn().mockReturnValue({
      zremrangebyscore: jest.fn().mockReturnThis(),
      zcard: jest.fn().mockReturnThis(),
      zadd: jest.fn().mockReturnThis(),
      expire: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([[null, 0], [null, 0], [null, 1]]),
    }),
  },
}));

jest.mock("@/lib/security/protection", () => ({
  withProtection: (handler: Function) => handler,
  RATE_LIMITS: {},
}));

jest.mock("@/lib/auth-utils", () => ({
  getServerAuth: jest.fn(),
}));

import { GET, POST } from "@/app/api/items/route";
import { getServerAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";

const prismaMock = prisma as unknown as {
  item: {
    findMany: jest.Mock;
    create: jest.Mock;
  };
};

describe("Items API", () => {
  const ctx = { params: Promise.resolve({}) };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("GET /api/items returns all items", async () => {
    const mockItems = [
      { id: "1", title: "Item 1", tags: [] },
      { id: "2", title: "Item 2", tags: [] },
    ];

    prismaMock.item.findMany.mockResolvedValue(mockItems as any);

    const req = new Request("http://localhost/api/items");
    const response = await GET(req, ctx);

    const data = await response.json();
    expect(data).toEqual(mockItems);
    expect(prismaMock.item.findMany).toHaveBeenCalled();
  });

  test("GET /api/items handles errors", async () => {
    prismaMock.item.findMany.mockRejectedValue(new Error("DB Error"));

    const req = new Request("http://localhost/api/items");
    const response = await GET(req, ctx);

    expect(response.status).toBe(500);
  });

  test("POST /api/items creates an item for admin", async () => {
    const session = { user: { id: "admin-1", role: "ADMIN" } };
    (getServerAuth as jest.Mock).mockResolvedValue(session);

    const newItem = {
      title: "New Book",
      type: "BOOK",
      tags: ["fiction"],
    };

    prismaMock.item.create.mockResolvedValue({
      id: "item-1",
      ...newItem,
      tags: [{ id: "tag-1", name: "fiction" }],
    } as any);

    const request = new Request("http://localhost/api/items", {
      method: "POST",
      body: JSON.stringify(newItem),
    });

    const ctx = { params: Promise.resolve({}) };
    const response = await POST(request, ctx);
    expect(response.status).toBe(200);
  });

  test("POST /api/items returns 401 for non-admin", async () => {
    const session = { user: { id: "user-1", role: "USER" } };
    (getServerAuth as jest.Mock).mockResolvedValue(session);

    const request = new Request("http://localhost/api/items", {
      method: "POST",
      body: JSON.stringify({ title: "Item" }),
    });

    const ctx = { params: Promise.resolve({}) };
    const response = await POST(request, ctx);
    expect(response.status).toBe(401);
  });
});
