import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenPayload } from 'src/modules/auth/types';
import { JwtService } from 'src/modules/auth/jwt.service';
import { AccessToken } from 'src/lib/utils/crypto/accessToken';

export type RequestWithAuth = Request & AccessTokenPayload;

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithAuth>();
    const token = this.extractTokenFromHeaders(request);

    if (!token) {
      this.logger.error('API token is missing');
      throw new UnauthorizedException('API token is missing');
    }

    const payload = await this.jwtService.verifyAsync({ token });

    request.user = payload.user;
    request.role = payload.role;

    return true;
  }

  private extractTokenFromHeaders(request: Request): AccessToken | undefined {
    const authorization = request.headers['authorization'];

    if (!authorization) {
      return undefined;
    }

    const [type, token] = authorization.split(' ');

    if (type !== 'Bearer' || !token) {
      return undefined;
    }

    return token as AccessToken;
  }
}
