import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenPayload } from 'src/modules/auth/types';

type RequestWithUser = Request & AccessTokenPayload;

export const getRequestUser = (
  _data: unknown,
  ctx: ExecutionContext,
): AccessTokenPayload => {
  const request = ctx.switchToHttp().getRequest<RequestWithUser>();
  return { user: request.user, role: request.role };
};

export const User = createParamDecorator(getRequestUser);
