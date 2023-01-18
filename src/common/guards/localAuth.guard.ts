import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../../features/api/super-admin/users/application/users.service';
import { LoginDto } from '../../features/api/public/auth/dto/login.dto';
import { UserSqlRepository } from '../../features/entities/postgres/userSql.repository';

@Injectable()
export class LocalAuthGuard implements CanActivate {
  constructor(
    //private userQueryRepo: UserQueryRepository,
    private userRepo: UserSqlRepository,
    private userService: UsersService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const loginDto: LoginDto = req.body;
    console.log(loginDto);
    const user = await this.checkCreds(loginDto);
    if (!user) throw new UnauthorizedException();
    if (user.isBanned) throw new UnauthorizedException();

    req.user = user;
    return true;
  }

  async checkCreds(loginDto) {
    const user = await this.userRepo.getUserByLoginOrEmail(
      loginDto.loginOrEmail,
    );
    console.log('User in creds with login ---> ' + loginDto.loginOrEmail);
    console.log(user);
    if (!user) return null;
    const passwordHash = await this.userService._generateHash(
      loginDto.password,
      user.passwordSalt,
    );
    if (user.passwordHash !== passwordHash) {
      return null;
    }
    return user;
  }
}
