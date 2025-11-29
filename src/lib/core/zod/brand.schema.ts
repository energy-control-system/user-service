import { UserId } from 'src/lib/domain/users/users.entity';
import z from 'zod';

export const UserIdSchema = z
  .number()
  .int()
  .positive()
  .transform<UserId>((n) => n as UserId);
