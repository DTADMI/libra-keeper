import { z } from "zod"

const itemSchema = z.object({
  title: z.string().min(1),
  type: z.enum(["BOOK", "MUSIC", "MOVIE", "GAME", "TOY", "OTHER"]),
  status: z
    .enum(["AVAILABLE", "BORROWED", "RESERVED", "UNAVAILABLE", "GIVEN_AWAY", "LOST"])
    .optional(),
});

describe("API Schema Validation", () => {
  test("itemSchema validates correct data", () => {
    const validItem = {
      title: "The Great Gatsby",
      type: "BOOK",
      status: "AVAILABLE",
    }
    expect(itemSchema.parse(validItem)).toEqual(validItem)
  })

  test("itemSchema fails on invalid data", () => {
    const invalidItem = {
      title: "",
      type: "INVALID_TYPE",
    }
    const result = itemSchema.safeParse(invalidItem)
    expect(result.success).toBe(false)
  })
});
