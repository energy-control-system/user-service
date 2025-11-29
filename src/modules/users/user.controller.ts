import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserId } from 'src/lib/domain/users/users.entity';
import { UsersRepository } from './users.repository';
import { GetUsersByIdsQueryDto, UserDto } from './dto';
import { ZodValidationPipe } from 'nestjs-zod';
import { UserIdSchema } from 'src/lib/core/zod/brand.schema';

@ApiTags('Users')
@ApiBearerAuth('bearer')
@Controller('users')
export class UserController {
  constructor(private readonly usersRepository: UsersRepository) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiOkResponse({ type: UserDto })
  public async getUserById(
    @Param('id', new ZodValidationPipe(UserIdSchema)) id: UserId,
  ) {
    const user = await this.usersRepository.getById({ id });
    return UserDto.fromEntity(user);
  }

  @Get('')
  @ApiOperation({ summary: 'Get multiple users by ids with pagination' })
  @ApiOkResponse({ type: [UserDto] })
  public async getUsersByIds(@Query() query: GetUsersByIdsQueryDto) {
    const users = await this.usersRepository.findMany(query);
    return users.map((user) => UserDto.fromEntity(user));
  }
}
