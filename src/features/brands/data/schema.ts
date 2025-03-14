import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const brandSchema = z.object({
  brand_id: z.number(),
  brand: z.string(),
  logo: z.string().nullable(),
  status: z.boolean(),
  created_on: z.string(),
})

export type Brand = z.infer<typeof brandSchema>
