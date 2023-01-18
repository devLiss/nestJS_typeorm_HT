import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserSqlRepository } from '../../features/entities/postgres/userSql.repository';
@Injectable()
export class CheckUserGuard implements CanActivate {
  constructor(
    private userQueryRepo: UserSqlRepository /*UserQueryRepository*/,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = await this.userQueryRepo.getUserById(req.params.id);
    if (!user) throw new NotFoundException();

    return true;
  }
}
