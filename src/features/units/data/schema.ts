import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const unitSchema = z.object({
  unit_id: z.number(),
  unit: z.string(),
  short_name: z.string().nullable(),
  no_of_products: z.number(),
  status: z.boolean(),
  created_on: z.string(),
  is_active: z.boolean(),
})

export type Unit = z.infer<typeof unitSchema>
