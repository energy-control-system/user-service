import { EmailValueType } from './email.value';
import { NameValueType } from './name.value';
import { PhoneValueType } from './phone.value';
import { Role } from './role.enum';
import { PasswordValueType } from './password.value';
import { Branded } from 'src/lib/utils/types';
import { Maybe } from 'src/lib/utils/types/helpers';
import { User } from 'src/lib/infrastructure/db/schema';
import {
  comparePassword,
  HashedPassword,
  hashPassword,
} from 'src/lib/utils/bcrypt';
import { AuthException, AuthExceptionCode } from '../exceptions/auth.exception';

export type RefreshToken = Branded<string, 'RefreshToken'>;
export type UserId = Branded<number, 'UserId'>;

export type UserEntityParams = {
  role?: Maybe<Role>;
  name: NameValueType;
  surname: NameValueType;
  patronymic?: Maybe<NameValueType>;
  phone: PhoneValueType;
  email: EmailValueType;
  password?: Maybe<PasswordValueType>;
  id?: Maybe<UserId>;
  passwordHash?: Maybe<HashedPassword>;

  refreshToken?: Maybe<RefreshToken>;
  refreshTokenExpiredAfter?: Maybe<Date>;
  createdAt?: Date;
  updatedAt?: Maybe<Date>;
};

export class UserEntity {
  private _id: UserId;
  private _role: Role;
  private _name: NameValueType;
  private _surname: NameValueType;
  private _patronymic: Maybe<NameValueType>;
  private _phone: PhoneValueType;
  private _email: EmailValueType;
  private _createdAt: Date;
  private _updatedAt: Maybe<Date>;
  private _refreshToken: Maybe<RefreshToken>;
  private _refreshTokenExpiredAfter: Maybe<Date>;
  private _passwordHash: HashedPassword;

  constructor(params: UserEntityParams) {
    const {
      role,
      name,
      surname,
      patronymic,
      phone,
      email,
      password,
      id,
      refreshToken,
      refreshTokenExpiredAfter,
      createdAt,
      updatedAt,
      passwordHash,
    } = params;

    if (!password && !passwordHash) {
      throw new AuthException(
        'Пароль не может быть пустым',
        AuthExceptionCode.INVALID_PASSWORD,
      );
    }

    this._id = id ?? (0 as UserId);
    this._email = email;
    this._name = name;
    this._surname = surname;
    this._patronymic = patronymic;
    this._phone = phone;
    this._role = role ?? Role.Inspector;
    this._refreshToken = refreshToken || null;
    this._refreshTokenExpiredAfter = refreshTokenExpiredAfter || null;
    this._createdAt = createdAt || new Date();
    this._updatedAt = updatedAt || null;

    if (password) {
      this._passwordHash = hashPassword(password);
      return;
    }
    if (passwordHash) {
      this._passwordHash = passwordHash;
      return;
    }
  }

  public comparePassword(password: PasswordValueType) {
    if (!comparePassword(password, this._passwordHash)) {
      throw new AuthException(
        'Неверный пароль',
        AuthExceptionCode.INVALID_PASSWORD,
      );
    }
  }

  get role(): Role {
    return this._role;
  }

  get name(): NameValueType {
    return this._name;
  }

  get surname(): NameValueType {
    return this._surname;
  }

  get patronymic(): Maybe<NameValueType> {
    return this._patronymic;
  }

  get phone(): PhoneValueType {
    return this._phone;
  }

  get email(): EmailValueType {
    return this._email;
  }

  get password(): HashedPassword {
    return this._passwordHash;
  }

  set password(newPassword: PasswordValueType) {
    this._passwordHash = hashPassword(newPassword);
  }

  set role(newRole: Role) {
    this._role = newRole;
  }

  get id(): UserId {
    return this._id;
  }

  get refreshToken(): Maybe<RefreshToken> {
    return this._refreshToken;
  }

  get refreshTokenExpiredAfter(): Maybe<Date> {
    return this._refreshTokenExpiredAfter;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Maybe<Date> {
    return this._updatedAt;
  }

  set refreshToken(token: Maybe<RefreshToken>) {
    this._refreshToken = token;
  }

  set refreshTokenExpiredAfter(date: Maybe<Date>) {
    this._refreshTokenExpiredAfter = date;
  }

  public static fromDb(db: User): UserEntity {
    return new UserEntity({
      id: db.id as UserId,
      role: db.roleId,
      name: NameValueType.fromString(db.name),
      surname: NameValueType.fromString(db.surname),
      patronymic: db.patronymic
        ? NameValueType.fromString(db.patronymic)
        : null,
      phone: PhoneValueType.fromString(db.phoneNumber),
      email: EmailValueType.fromString(db.email),
      passwordHash: db.passwordHash as HashedPassword,
      refreshToken: db.refreshToken as Maybe<RefreshToken>,
      refreshTokenExpiredAfter: db.refreshTokenExpiredAfter || null,
      createdAt: db.createdAt,
      updatedAt: db.updatedAt || null,
    });
  }
}
