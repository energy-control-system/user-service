import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { AccessTokenPayload } from './types';
import { AccessToken } from 'src/lib/utils/crypto/accessToken';
import { ConfigService } from '@nestjs/config';
import { createBranded } from 'src/lib/utils/types';
import {
  AuthException,
  AuthExceptionCode,
} from 'src/lib/domain/exceptions/auth.exception';
import { UserEntity } from 'src/lib/domain/users/users.entity';

@Injectable()
export class JwtService {
  constructor(
    private readonly jwt: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  public sign(payload: AccessTokenPayload | UserEntity): AccessToken {
    const { token } = this.signWithMeta(payload);
    return token;
  }

  public signWithMeta(payload: AccessTokenPayload | UserEntity) {
    const secret = this.configService.getOrThrow<string>('JWT_SECRET');
    const expiresIn = Number(
      this.configService.getOrThrow<string | number>('JWT_EXPIRES_IN'),
    );

    let data: AccessTokenPayload;

    if (payload instanceof UserEntity) {
      data = { user: payload.id, role: payload.role };
    } else {
      data = payload;
    }

    const token = this.jwt.sign<AccessTokenPayload>(data, {
      secret,
      expiresIn,
    });

    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    return {
      token: createBranded<string, 'AccessToken'>(token),
      expiresAt,
    };
  }

  public async verifyAsync(params: {
    token: AccessToken;
  }): Promise<AccessTokenPayload> {
    const { token } = params;

    const secret = this.configService.getOrThrow<string>('JWT_SECRET');

    try {
      return await this.jwt.verifyAsync<AccessTokenPayload>(token, { secret });
    } catch {
      throw new AuthException(
        'Неверный токен',
        AuthExceptionCode.INVALID_TOKEN,
      );
    }
  }
}
