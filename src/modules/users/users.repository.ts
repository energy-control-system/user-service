import { Inject, Injectable } from '@nestjs/common';
import { eq, inArray, sql } from 'drizzle-orm';
import {
  AuthException,
  AuthExceptionCode,
} from 'src/lib/domain/exceptions/auth.exception';
import {
  UsersException,
  UsersExceptionCode,
} from 'src/lib/domain/exceptions/users.exception';
import { EmailValueType } from 'src/lib/domain/users/email.value';
import { NameValueType } from 'src/lib/domain/users/name.value';
import { PasswordValueType } from 'src/lib/domain/users/password.value';
import { PhoneValueType } from 'src/lib/domain/users/phone.value';
import { UserEntity, UserId } from 'src/lib/domain/users/users.entity';
import { Schema } from 'src/lib/infrastructure/db';
import { users } from 'src/lib/infrastructure/db/schema';
import { RefreshToken } from 'src/lib/utils/crypto/refreshToken';
import { Maybe, PaginationArgs } from 'src/lib/utils/types/helpers';

export type UserCreateParams = {
  email: EmailValueType;
  phone: PhoneValueType;
  name: NameValueType;
  surname: NameValueType;
  password: PasswordValueType;
  patronymic?: Maybe<NameValueType>;
};

@Injectable()
export class UsersRepository {
  constructor(@Inject('DB') private readonly drizzle: Schema) {}

  public async save(params: UserEntity) {
    const {
      id,
      email,
      phone,
      name,
      surname,
      patronymic,
      role,
      password,
      refreshToken,
      refreshTokenExpiredAfter,
    } = params;

    const shouldCreate = !id || (id as unknown as number) === 0;

    if (!shouldCreate) {
      const patch = {
        email: email.getValue(),
        phoneNumber: phone.getValue(),
        name: name.getValue(),
        surname: surname.getValue(),
        patronymic: patronymic?.getValue() ?? null,
        ...(role !== undefined ? { roleId: role } : {}),
        ...(password ? { passwordHash: password } : {}),
        ...(refreshToken !== undefined
          ? { refreshToken: refreshToken ?? null }
          : {}),
        ...(refreshTokenExpiredAfter !== undefined
          ? { refreshTokenExpiredAfter: refreshTokenExpiredAfter ?? null }
          : {}),
        updatedAt: sql`now()`,
      };

      const updated = await this.drizzle
        .update(users)
        .set(patch)
        .where(eq(users.id, id))
        .returning();

      return UserEntity.fromDb(updated[0]);
    }

    if (!password) {
      throw new AuthException(
        'Пароль обязателен',
        AuthExceptionCode.INVALID_PASSWORD,
      );
    }

    const created = await this.drizzle
      .insert(users)
      .values({
        name: name.getValue(),
        surname: surname.getValue(),
        patronymic: patronymic?.getValue() ?? null,
        passwordHash: password,
        email: email.getValue(),
        phoneNumber: phone.getValue(),
        roleId: role,
        refreshToken,
        refreshTokenExpiredAfter,
      })
      .returning();

    return UserEntity.fromDb(created[0]);
  }

  public async getByPhoneOrEmail(params: {
    login: PhoneValueType | EmailValueType;
  }) {
    const { login } = params;

    if (login instanceof PhoneValueType) {
      return this.getByPhone({ phone: login });
    }

    if (login instanceof EmailValueType) {
      return this.getByEmail({ email: login });
    }

    throw new UsersException(
      'Неверный логин',
      UsersExceptionCode.INVALID_LOGIN,
    );
  }

  public async getByEmail(params: { email: EmailValueType }) {
    const { email } = params;

    const candidate = await this.drizzle.query.users.findFirst({
      where: eq(users.email, email.getValue()),
    });

    if (!candidate) {
      throw new UsersException(
        'Пользователь не найден',
        UsersExceptionCode.USER_NOT_FOUND,
      );
    }

    return UserEntity.fromDb(candidate);
  }

  public async getByEmailOrNull(params: { email: EmailValueType }) {
    const { email } = params;

    const candidate = await this.drizzle.query.users.findFirst({
      where: eq(users.email, email.getValue()),
    });

    if (!candidate) return null;

    return UserEntity.fromDb(candidate);
  }

  public async getByPhone(params: { phone: PhoneValueType }) {
    const { phone } = params;

    const candidate = await this.drizzle.query.users.findFirst({
      where: eq(users.phoneNumber, phone.getValue()),
    });

    if (!candidate) {
      throw new UsersException(
        'Пользователь не найден',
        UsersExceptionCode.USER_NOT_FOUND,
      );
    }

    return UserEntity.fromDb(candidate);
  }

  public async getByPhoneOrNull(params: { phone: PhoneValueType }) {
    const { phone } = params;

    const candidate = await this.drizzle.query.users.findFirst({
      where: eq(users.phoneNumber, phone.getValue()),
    });

    if (!candidate) return null;

    return UserEntity.fromDb(candidate);
  }

  public async findMany(
    params: { ids?: Array<UserId> } & Partial<PaginationArgs>,
  ) {
    const { ids, limit, offset } = params;

    console.log(ids);

    const usersList = await this.drizzle.query.users.findMany({
      where: ids && ids.length > 0 ? inArray(users.id, ids) : undefined,
      limit,
      offset,
    });

    return usersList.map((user) => UserEntity.fromDb(user));
  }

  public async getByRefreshToken(params: { token: RefreshToken }) {
    const { token } = params;

    const user = await this.drizzle.query.users.findFirst({
      where: eq(users.refreshToken, token),
    });

    if (!user) {
      return null;
    }

    return UserEntity.fromDb(user);
  }

  public async getById(params: { id: UserId }) {
    const { id } = params;

    const user = await this.drizzle.query.users.findFirst({
      where: eq(users.id, id),
    });

    if (!user) {
      throw new UsersException(
        'Пользователь не найден',
        UsersExceptionCode.USER_NOT_FOUND,
      );
    }

    return UserEntity.fromDb(user);
  }
}
