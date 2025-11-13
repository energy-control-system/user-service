import { ValueType } from '../core/value';
import {
  UsersException,
  UsersExceptionCode,
} from '../exceptions/users.exception';

export class EmailValueType extends ValueType<string> {
  constructor(value: string) {
    if (!EmailValueType.validateEmail(value)) {
      throw new UsersException(
        'Неверный формат email',
        UsersExceptionCode.INVALID_EMAIL,
      );
    }

    super(value);
  }

  private static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  public static fromString(value: string): EmailValueType {
    return new EmailValueType(value);
  }
}
