import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const categorySchema = z.object({
  category_id: z.number(),
  category: z.string(),
  category_slug: z.string(),
  status: z.boolean(),
  created_on: z.string(),
})

export type Category = z.infer<typeof categorySchema>
