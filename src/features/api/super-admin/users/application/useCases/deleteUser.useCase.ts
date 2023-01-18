import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserSqlRepository } from '../../../../../entities/postgres/userSql.repository';

export class DeleteUserCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase implements ICommandHandler<DeleteUserCommand> {
  constructor(private userRepo: UserSqlRepository) {}

  execute(command: DeleteUserCommand): Promise<any> {
    return this.userRepo.deleteUser(command.id);
  }
}
