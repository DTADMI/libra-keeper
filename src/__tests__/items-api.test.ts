jest.mock("@/lib/db", () => ({
  prisma: {
    item: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("GET /api/items returns all items", async () => {
    const mockItems = [
      { id: "1", title: "Item 1", tags: [] },
      { id: "2", title: "Item 2", tags: [] },
    ];

    prismaMock.item.findMany.mockResolvedValue(mockItems as any);

    const response = await GET();
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toEqual(mockItems);
    expect(prismaMock.item.findMany).toHaveBeenCalled();
  });

  test("GET /api/items handles errors", async () => {
    prismaMock.item.findMany.mockRejectedValue(new Error("DB Error"));

    const response = await GET();

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

    const response = await POST(request);
    expect(response.status).toBe(200);
  });

  test("POST /api/items returns 401 for non-admin", async () => {
    const session = { user: { id: "user-1", role: "USER" } };
    (getServerAuth as jest.Mock).mockResolvedValue(session);

    const request = new Request("http://localhost/api/items", {
      method: "POST",
      body: JSON.stringify({ title: "Item" }),
    });

    const response = await POST(request);
    expect(response.status).toBe(401);
  });
});
