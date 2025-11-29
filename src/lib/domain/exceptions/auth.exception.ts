import { HttpStatus } from '@nestjs/common';
import { DomainException } from '../core/exception';

export class AuthException extends DomainException {
  constructor(message: string, internalErrorCode: AuthExceptionCode) {
    super(
      message,
      AuthExceptionHTTPStatus[internalErrorCode],
      internalErrorCode,
    );
  }
}

export enum AuthExceptionCode {
  INVALID_PASSWORD = 'INVALID_PASSWORD',
  INVALID_TOKEN = 'INVALID_TOKEN',
  INVALID_REFRESH_TOKEN = 'INVALID_REFRESH_TOKEN',
  EXPIRED_REFRESH_TOKEN = 'EXPIRED_REFRESH_TOKEN',
}

const AuthExceptionHTTPStatus = {
  [AuthExceptionCode.INVALID_PASSWORD]: HttpStatus.FORBIDDEN,
  [AuthExceptionCode.INVALID_TOKEN]: HttpStatus.FORBIDDEN,
  [AuthExceptionCode.INVALID_REFRESH_TOKEN]: HttpStatus.UNAUTHORIZED,
  [AuthExceptionCode.EXPIRED_REFRESH_TOKEN]: HttpStatus.UNAUTHORIZED,
};
