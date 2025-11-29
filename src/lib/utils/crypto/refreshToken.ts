import { randomUUID } from 'crypto';
import { Branded, createBranded } from '../types';

export type RefreshToken = Branded<string, 'RefreshToken'>;

export const createRefreshToken = (): {
  token: RefreshToken;
  expiredAfter: Date;
} => {
  const token = createBranded<string, 'RefreshToken'>(
    `${randomUUID()}${randomUUID()}${randomUUID()}`.split('-').join(''),
  );

  return { token, expiredAfter: new Date(Date.now() + 86400_000) }; // TODO: remove magic value
};
