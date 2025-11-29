import { UserIdSchema } from 'src/lib/core/zod/brand.schema';
import { PaginationQuerySchema } from 'src/lib/core/zod/pagination';
import { Role } from 'src/lib/domain/users/role.enum';
import z from 'zod';

export const GetUsersByIdsQuerySchema = PaginationQuerySchema.extend({
  ids: z
    .string()
    .min(1, 'ids is required')
    .describe('Comma-separated list of user ids')
    .transform((v) =>
      v
        .split(',')
        .map((val) => Number(val))
        .filter((n) => !Number.isNaN(n)),
    )
    .pipe(z.array(UserIdSchema)),
}).describe('Users lookup query params');

export const UserSchema = z
  .object({
    id: UserIdSchema,
    role: z.enum(Role),
    name: z.string(),
    surname: z.string(),
    patronymic: z.string().nullable(),
    phone: z.string(),
    email: z.email(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime().nullable(),
  })
  .describe('User');

export const UserDtoSchema = z.object({
  id: UserIdSchema.describe('User identifier'),
  email: z.email().describe('Email address'),
  phone: z.string().describe('Phone number'),
  name: z.string().describe('First name'),
  surname: z.string().describe('Last name'),
  patronymic: z.string().nullable().describe('Patronymic'),
  role: z.number().describe('User role'),
});
