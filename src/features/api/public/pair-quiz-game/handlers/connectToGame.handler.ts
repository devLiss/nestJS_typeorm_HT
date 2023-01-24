import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PairQuizGameRepository } from '../pair-quiz-game.repository';
import { ForbiddenException } from '@nestjs/common';

export class ConnectToGameCommand {
  constructor(public userId: string) {}
}

@CommandHandler(ConnectToGameCommand)
export class ConnectToGameHandler
  implements ICommandHandler<ConnectToGameCommand>
{
  constructor(private repo: PairQuizGameRepository) {}

  async execute(command: ConnectToGameCommand): Promise<any> {
    const existedGame = await this.repo.getExistingGame(command.userId);
    console.log('existed game ', existedGame);
    if (existedGame) throw new ForbiddenException();
    return this.repo.connectToGame(command.userId);
  }
}
