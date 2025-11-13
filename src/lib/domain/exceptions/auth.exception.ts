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
}

const AuthExceptionHTTPStatus = {
  [AuthExceptionCode.INVALID_PASSWORD]: HttpStatus.FORBIDDEN,
};
