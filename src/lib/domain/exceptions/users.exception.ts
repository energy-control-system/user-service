import { HttpStatus } from '@nestjs/common';
import { DomainException } from '../core/exception';

export class UsersException extends DomainException {
  constructor(message: string, internalErrorCode: UsersExceptionCode) {
    super(
      message,
      UsersExceptionHTTPStatus[internalErrorCode],
      internalErrorCode,
    );
  }
}

export enum UsersExceptionCode {
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
  INVALID_EMAIL = 'INVALID_EMAIL',
  INVALID_PHONE = 'INVALID_PHONE',
  INVALID_NAME = 'INVALID_NAME',
  INVALID_ID = 'INVALID_ID',
  INVALID_LOGIN = 'INVALID_LOGIN',
}

const UsersExceptionHTTPStatus = {
  [UsersExceptionCode.USER_NOT_FOUND]: HttpStatus.NOT_FOUND,
  [UsersExceptionCode.USER_ALREADY_EXISTS]: HttpStatus.CONFLICT,
  [UsersExceptionCode.INVALID_EMAIL]: HttpStatus.BAD_REQUEST,
  [UsersExceptionCode.INVALID_PHONE]: HttpStatus.BAD_REQUEST,
  [UsersExceptionCode.INVALID_NAME]: HttpStatus.BAD_REQUEST,
  [UsersExceptionCode.INVALID_ID]: HttpStatus.BAD_REQUEST,
  [UsersExceptionCode.INVALID_LOGIN]: HttpStatus.BAD_REQUEST,
};
