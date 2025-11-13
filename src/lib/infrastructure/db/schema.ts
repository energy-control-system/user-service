import { InferInsertModel, InferSelectModel, sql } from 'drizzle-orm';
import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
  check,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),

    roleId: integer('role_id').notNull(), // 1 - Inspector, 2 - Dispatcher, 3 - Specialist

    surname: text('surname').notNull(),
    name: text('name').notNull(),
    patronymic: text('patronymic'),

    phoneNumber: text('phone_number').notNull().unique(),

    email: text('email').notNull().unique(),

    passwordHash: text('password_hash').notNull(),
    refreshToken: text('refresh_token'),
    refreshTokenExpiredAfter: timestamp('refresh_token_expired_after', {
      withTimezone: true,
    }),

    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      'phone_number_format',
      sql`${table.phoneNumber} ~ '^(\+7|8)\\d{10}$'`,
    ),
    check(
      'email_format',
      sql`${table.email} ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'`,
    ),
    uniqueIndex('users_phone_number_unique').on(table.phoneNumber),
    uniqueIndex('users_email_unique').on(table.email),
  ],
);

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
