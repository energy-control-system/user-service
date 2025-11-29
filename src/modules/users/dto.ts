import { createZodDto } from 'nestjs-zod';
import { GetUsersByIdsQuerySchema, UserSchema } from './schema';
import { UserEntity } from 'src/lib/domain/users/users.entity';

export class GetUsersByIdsQueryDto extends createZodDto(
  GetUsersByIdsQuerySchema,
) {}

export class UserDto extends createZodDto(UserSchema) {
  public static fromEntity(user: UserEntity) {
    return UserSchema.parse({
      id: user.id,
      role: user.role,
      name: user.name.getValue(),
      surname: user.surname.getValue(),
      patronymic: user.patronymic?.getValue() ?? null,
      phone: user.phone.getValue(),
      email: user.email.getValue(),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt ? user.updatedAt.toISOString() : null,
    });
  }
}
