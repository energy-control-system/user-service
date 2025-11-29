import z from 'zod';

const MAX_LIMIT = 20;

export const PaginationQuerySchema = z.object({
  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(MAX_LIMIT)
    .default(MAX_LIMIT)
    .describe(`Number of items to return (max ${MAX_LIMIT})`),
  offset: z.coerce
    .number()
    .int()
    .min(0)
    .default(0)
    .describe('Number of items to skip'),
});
