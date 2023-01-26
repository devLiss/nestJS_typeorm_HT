import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PairQuizGameRepository } from '../pair-quiz-game.repository';
import { ForbiddenException } from '@nestjs/common';

export class ConnectToGameCommand {
  constructor(public user: any) {}
}

@CommandHandler(ConnectToGameCommand)
export class ConnectToGameHandler
  implements ICommandHandler<ConnectToGameCommand>
{
  constructor(private repo: PairQuizGameRepository) {}

  async execute(command: ConnectToGameCommand): Promise<any> {
    const existedGame = await this.repo.getExistingGame(command.user.id);
    console.log('existed game ', existedGame);

    console.log('user who want to connect =>  ', command.user.id);
    if (existedGame.length) throw new ForbiddenException();
    const createdGame = await this.repo.connectToGame(command.user.id);
    console.log('Created Game ==> ', createdGame);
    return {
      id: createdGame.id,
      firstPlayerProgress: {
        answers: [],
        player: {
          id: command.user.id,
          login: command.user.login,
        },
        score: 0,
      },
      secondPlayerProgress: null,
      questions: null,
      status: createdGame.status,
      pairCreatedDate: createdGame.pairCreatedDate,
      startGameDate: createdGame.startGameDate,
      finishGameDate: createdGame.finishGameDate,
    };
  }
}
