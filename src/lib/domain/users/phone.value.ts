import { ValueType } from '../core/value';
import {
  UsersException,
  UsersExceptionCode,
} from '../exceptions/users.exception';

const phoneRegex = /^\+?[1-9]\d{1,14}$/;

export class PhoneValueType extends ValueType<string> {
  constructor(value: string) {
    if (!PhoneValueType.isStringValid(value)) {
      throw new UsersException(
        'Неверный формат номера телефона',
        UsersExceptionCode.INVALID_PHONE,
      );
    }

    super(value);
  }

  public static fromString(value: string): PhoneValueType {
    return new PhoneValueType(value);
  }

  public static isStringValid(value: string): boolean {
    return phoneRegex.test(value);
  }
}
