import { createZodDto } from 'nestjs-zod';
import {
  AuthTokensSchema,
  LoginSchema,
  RefreshSchema,
  TokenResponseSchema,
  RegisterSchema,
} from './schema';

export class LoginDto extends createZodDto(LoginSchema) {}
export class RegisterDto extends createZodDto(RegisterSchema) {}
export class TokenResponseDto extends createZodDto(TokenResponseSchema) {}
export class AuthTokensDto extends createZodDto(AuthTokensSchema) {}
export class RefreshDto extends createZodDto(RefreshSchema) {}
