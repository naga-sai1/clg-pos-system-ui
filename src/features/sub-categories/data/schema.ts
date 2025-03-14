import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const subCategorySchema = z.object({
  sub_category_id: z.number(),
  sub_category: z.string(),
  description: z.string(),
  created_on: z.string(),
  updated_on: z.string().nullable(),
  status: z.boolean(),
  category: z.string(),
  created_by: z.string(),
})

export type SubCategory = z.infer<typeof subCategorySchema>
