import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthTokensDto, LoginDto, RefreshDto, RegisterDto } from './dto';
import { UsersRepository } from '../users/users.repository';
import { User } from 'src/lib/core/decorators/user.decorator';
import { JwtAuthGuard } from 'src/lib/core/guards/jwt.guard';
import { UserDto } from '../users/dto';
import { AccessTokenPayload } from './types';

@ApiTags('Auth')
@ApiBearerAuth('bearer')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersRepository: UsersRepository,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login with email or phone' })
  @ApiOkResponse({ type: AuthTokensDto })
  public async login(@Body() dto: LoginDto) {
    const { login, password } = dto;

    return this.authService.login({
      login,
      password,
    });
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiOkResponse({ type: AuthTokensDto })
  public async register(@Body() dto: RegisterDto) {
    const { email, phone, password, name, surname, patronymic } = dto;

    return this.authService.register({
      email,
      phone,
      password,
      patronymic,
      name,
      surname,
    });
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access and refresh tokens' })
  @ApiOkResponse({ type: AuthTokensDto })
  public async refresh(@Body() dto: RefreshDto) {
    return this.authService.refreshTokens({ refreshToken: dto.refreshToken });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user info' })
  @ApiOkResponse({ type: UserDto })
  public async getCurrentUser(@User() { user }: AccessTokenPayload) {
    return UserDto.fromEntity(await this.usersRepository.getById({ id: user }));
  }
}
