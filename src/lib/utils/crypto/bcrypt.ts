import * as bcrypt from 'bcrypt';
import { Branded, createBranded } from '../types';
import { PasswordValueType } from 'src/lib/domain/users/password.value';

const SALT_ROUNDS = 10;

export type HashedPassword = Branded<string, 'HashedPassword'>;

export const hashPassword = (password: PasswordValueType) => {
  return createBranded<string, 'HashedPassword'>(
    bcrypt.hashSync(password.getValue(), SALT_ROUNDS),
  );
};

export const comparePassword = (
  plain: PasswordValueType,
  hashed: HashedPassword,
) => {
  return bcrypt.compareSync(plain.getValue(), hashed);
};
