import { EmailValueType } from 'src/lib/domain/users/email.value';
import { NameValueType } from 'src/lib/domain/users/name.value';
import { PasswordValueType } from 'src/lib/domain/users/password.value';
import { PhoneValueType } from 'src/lib/domain/users/phone.value';
import { RefreshToken } from 'src/lib/utils/crypto/refreshToken';
import { Or } from 'src/lib/utils/types/helpers';
import z from 'zod';

const parseLogin = (login: string): Or<PhoneValueType, EmailValueType> => {
  if (PhoneValueType.isStringValid(login)) {
    return PhoneValueType.fromString(login);
  }
  return new EmailValueType(login);
};

export const LoginSchema = z
  .object({
    login: z.string().describe('Phone number or email').transform(parseLogin),
    password: z
      .string()
      .describe('Password')
      .transform((pwd) => new PasswordValueType(pwd)),
  })
  .describe('Login payload')
  .meta({ id: 'LoginDto' });

export const RegisterSchema = z
  .object({
    email: z
      .email()
      .describe('Email address')
      .transform((email) => EmailValueType.fromString(email)),
    phone: z
      .string()
      .describe('Phone number')
      .transform((phone) => PhoneValueType.fromString(phone)),
    password: z
      .string()
      .describe('Password')
      .transform((pwd) => new PasswordValueType(pwd)),
    name: z
      .string()
      .describe('First name')
      .transform((name) => NameValueType.fromString(name)),
    surname: z
      .string()
      .describe('Last name')
      .transform((surname) => NameValueType.fromString(surname)),
    patronymic: z
      .string()
      .describe('Patronymic')
      .optional()
      .transform((patronymic) =>
        patronymic ? NameValueType.fromString(patronymic) : undefined,
      ),
  })
  .describe('Registration payload')
  .meta({ id: 'RegisterDto' });

export const TokenResponseSchema = z
  .object({
    token: z.string().describe('JWT token'),
    expiresAt: z.iso.datetime().describe('Expiration time in ISO format'),
  })
  .describe('JWT token with expiration')
  .meta({ id: 'TokenResponse' });

export const AuthTokensSchema = z
  .object({
    access: TokenResponseSchema.describe('Access token'),
    refresh: TokenResponseSchema.describe('Refresh token'),
  })
  .describe('Auth tokens bundle')
  .meta({ id: 'AuthTokens' });

export const RefreshSchema = z
  .object({
    refreshToken: z
      .string()
      .transform<RefreshToken>((n) => n as RefreshToken)
      .describe('Refresh token'),
  })
  .describe('Refresh token payload')
  .meta({ id: 'RefreshDto' });
