import { Injectable } from '@nestjs/common';
import { UserCreateParams, UsersService } from '../users/users.service';
import { EmailValueType } from 'src/lib/domain/users/email.value';
import { PhoneValueType } from 'src/lib/domain/users/phone.value';
import { PasswordValueType } from 'src/lib/domain/users/password.value';
import { UserEntity } from 'src/lib/domain/users/users.entity';
import {
  UsersException,
  UsersExceptionCode,
} from 'src/lib/domain/exceptions/users.exception';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  private async assertEmailIsNotUsed(email: EmailValueType) {
    const candidate = await this.usersService.getByEmail({ email });

    if (candidate) {
      throw new UsersException(
        'Пользователь с таким email уже существует',
        UsersExceptionCode.USER_ALREADY_EXISTS,
      );
    }
  }

  private async assertPhoneIsNotUsed(phone: PhoneValueType) {
    const candidate = await this.usersService.getByPhone({ phone });

    if (candidate) {
      throw new UsersException(
        'Пользователь с таким номером телефона уже существует',
        UsersExceptionCode.USER_ALREADY_EXISTS,
      );
    }
  }

  public async login(params: {
    login: EmailValueType | PhoneValueType;
    password: PasswordValueType;
  }) {
    const { login, password } = params;

    const candidate = await this.usersService.getByPhoneOrEmail({ login });

    candidate.comparePassword(password);

    const token = 'generated-jwt-token'; // Здесь должна быть логика генерации JWT

    return token;
  }

  public async register(params: UserCreateParams) {
    const { email, phone, name, surname, password, patronymic } = params;

    await this.assertEmailIsNotUsed(email);
    await this.assertPhoneIsNotUsed(phone);

    await this.usersService.upsert(
      new UserEntity({
        email,
        phone,
        name,
        surname,
        password,
        patronymic,
      }),
    );

    const token = 'generated-jwt-token'; // Здесь должна быть логика генерации JWT

    return token;
  }
}
