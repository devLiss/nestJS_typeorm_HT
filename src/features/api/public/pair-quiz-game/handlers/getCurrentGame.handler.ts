import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PairQuizGameRepository } from '../pair-quiz-game.repository';
import { NotFoundException } from '@nestjs/common';

export class GetCurrentGameQuery {
  constructor(public userId: string) {}
}

@QueryHandler(GetCurrentGameQuery)
export class GetCurrentGameHandler
  implements IQueryHandler<GetCurrentGameQuery>
{
  constructor(private repo: PairQuizGameRepository) {}

  async execute(query: GetCurrentGameQuery): Promise<any> {
    const currentGame = await this.repo.getExistingGame(query.userId);
    console.log(currentGame);
    if (!currentGame.length) throw new NotFoundException();

    const game = await this.repo.getCurrentGameInfo(currentGame[0].id);
    return game;
  }
}
