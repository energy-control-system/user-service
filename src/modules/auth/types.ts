import { Role } from 'src/lib/domain/users/role.enum';
import { UserId } from 'src/lib/domain/users/users.entity';

export interface AccessTokenPayload {
  user: UserId;
  role: Role;
}
