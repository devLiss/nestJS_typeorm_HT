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
    const currentGame = await this.repo.getCurrentGame(query.userId);
    if (!currentGame) throw new NotFoundException();
    return this.repo.getCurrentGameInfo(currentGame.id);
  }
}
