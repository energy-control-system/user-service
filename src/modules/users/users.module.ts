import { Module } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UserController } from './user.controller';

@Module({
  providers: [UsersRepository],
  exports: [UsersRepository],
  controllers: [UserController],
})
export class UsersModule {}
