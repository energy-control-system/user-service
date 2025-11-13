import { ValueType } from '../core/value';
import { AuthException, AuthExceptionCode } from '../exceptions/auth.exception';

export class PasswordValueType extends ValueType<string> {
  constructor(value: string) {
    if (value.length < 8) {
      throw new AuthException(
        'Пароль должен содержать не менее 8 символов',
        AuthExceptionCode.INVALID_PASSWORD,
      );
    }

    super(value);
  }

  public static fromString(value: string): PasswordValueType {
    return new PasswordValueType(value);
  }
}
