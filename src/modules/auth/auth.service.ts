import { Injectable } from '@nestjs/common';
import { UserCreateParams, UsersRepository } from '../users/users.repository';
import { EmailValueType } from 'src/lib/domain/users/email.value';
import { PhoneValueType } from 'src/lib/domain/users/phone.value';
import { PasswordValueType } from 'src/lib/domain/users/password.value';
import { UserEntity } from 'src/lib/domain/users/users.entity';
import {
  UsersException,
  UsersExceptionCode,
} from 'src/lib/domain/exceptions/users.exception';
import { JwtService } from './jwt.service';
import { Or } from 'src/lib/utils/types/helpers';
import {
  AuthException,
  AuthExceptionCode,
} from 'src/lib/domain/exceptions/auth.exception';
import {
  createRefreshToken,
  RefreshToken,
} from 'src/lib/utils/crypto/refreshToken';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  private async assertEmailIsNotUsed(email: EmailValueType) {
    const candidate = await this.usersRepository.getByEmailOrNull({ email });

    if (candidate) {
      throw new UsersException(
        'Пользователь с таким email уже существует',
        UsersExceptionCode.USER_ALREADY_EXISTS,
      );
    }
  }

  private async assertPhoneIsNotUsed(phone: PhoneValueType) {
    const candidate = await this.usersRepository.getByPhoneOrNull({ phone });

    if (candidate) {
      throw new UsersException(
        'Пользователь с таким номером телефона уже существует',
        UsersExceptionCode.USER_ALREADY_EXISTS,
      );
    }
  }

  public async login(params: {
    login: Or<EmailValueType, PhoneValueType>;
    password: PasswordValueType;
  }) {
    const { login, password } = params;

    const candidate = await this.usersRepository.getByPhoneOrEmail({ login });

    candidate.comparePassword(password);

    const refreshUpdated = this.ensureRefreshToken(candidate);

    if (refreshUpdated) {
      await this.usersRepository.save(candidate);
    }

    return this.buildTokens(candidate);
  }

  public async register(params: UserCreateParams) {
    const { email, phone, name, surname, password, patronymic } = params;

    await this.assertEmailIsNotUsed(email);
    await this.assertPhoneIsNotUsed(phone);

    const newUser = new UserEntity({
      email,
      phone,
      name,
      surname,
      password,
      patronymic,
    });

    const savedUser = await this.usersRepository.save(newUser);

    const refreshUpdated = this.ensureRefreshToken(savedUser);

    if (refreshUpdated) {
      await this.usersRepository.save(savedUser);
    }

    return this.buildTokens(savedUser);
  }

  public async refreshTokens(params: { refreshToken: RefreshToken }) {
    const { refreshToken } = params;

    const user = await this.usersRepository.getByRefreshToken({
      token: refreshToken,
    });

    if (!user || !user.refreshToken || user.refreshToken !== refreshToken) {
      throw new AuthException(
        'Invalid refresh token',
        AuthExceptionCode.INVALID_REFRESH_TOKEN,
      );
    }

    if (user.isRefreshTokenExpired()) {
      throw new AuthException(
        'Refresh token expired',
        AuthExceptionCode.EXPIRED_REFRESH_TOKEN,
      );
    }

    this.rotateRefreshToken(user);
    await this.usersRepository.save(user);

    return this.buildTokens(user);
  }

  private ensureRefreshToken(user: UserEntity) {
    if (
      !user.refreshToken ||
      !user.refreshTokenExpiredAfter ||
      user.isRefreshTokenExpired()
    ) {
      this.rotateRefreshToken(user);
      return true;
    }

    return false;
  }

  private rotateRefreshToken(user: UserEntity) {
    const { token, expiredAfter } = createRefreshToken();
    user.refreshToken = token;
    user.refreshTokenExpiredAfter = expiredAfter;
  }

  private buildTokens(user: UserEntity) {
    const access = this.jwtService.signWithMeta(user);

    if (!user.refreshToken || !user.refreshTokenExpiredAfter) {
      throw new AuthException(
        'Invalid refresh token state',
        AuthExceptionCode.INVALID_REFRESH_TOKEN,
      );
    }

    return {
      access: {
        token: access.token,
        expiresAt: access.expiresAt.toISOString(),
      },
      refresh: {
        token: user.refreshToken,
        expiresAt: user.refreshTokenExpiredAfter.toISOString(),
      },
    };
  }
}
