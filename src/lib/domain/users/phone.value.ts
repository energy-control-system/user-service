import { ValueType } from '../core/value';
import {
  UsersException,
  UsersExceptionCode,
} from '../exceptions/users.exception';

export class PhoneValueType extends ValueType<string> {
  constructor(value: string) {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;

    if (!phoneRegex.test(value)) {
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
}
