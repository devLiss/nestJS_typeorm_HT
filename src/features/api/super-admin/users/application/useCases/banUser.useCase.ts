import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BanDto } from '../../dto/ban.dto';
import { SessionsService } from '../../../../public/sessions/application/sessions.service';
import { UserSqlRepository } from '../../../../../entities/postgres/userSql.repository';

export class BanUserCommand {
  constructor(public id: string, public banDto: BanDto) {}
}
@CommandHandler(BanUserCommand)
export class BanUserUseCase implements ICommandHandler<BanUserCommand> {
  constructor(
    private userRepo: UserSqlRepository,
    private sessionService: SessionsService,
  ) {}

  async execute(command: BanUserCommand): Promise<any> {
    const bannedUser = await this.userRepo.banUser(command.id, command.banDto);
    console.log(bannedUser);
    //const comments = await this.commentRepo.updateUserInfo(bannedUser);
    const session = await this.sessionService.removeUserSessions(command.id);

    return bannedUser;
  }
}
