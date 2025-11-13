import { ValueType } from '../core/value';
import {
  UsersException,
  UsersExceptionCode,
} from '../exceptions/users.exception';

export class NameValueType extends ValueType<string> {
  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new UsersException(
        'Имя не может быть пустым',
        UsersExceptionCode.INVALID_NAME,
      );
    }

    const regex = /^[a-zA-Zа-яА-ЯёЁ\s-]+$/;
    if (!regex.test(value)) {
      throw new UsersException(
        'Имя может содержать только буквы, пробелы и дефисы',
        UsersExceptionCode.INVALID_NAME,
      );
    }

    super(value.charAt(0).toUpperCase() + value.slice(1).toLowerCase());
  }

  public static fromString(value: string): NameValueType {
    return new NameValueType(value);
  }
}
