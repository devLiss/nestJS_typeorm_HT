import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PairQuizGameRepository } from '../pair-quiz-game.repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

export class GetQuizByIdQuery {
  constructor(public id: string, public userId: string) {}
}

@QueryHandler(GetQuizByIdQuery)
export class GetQuizByIdHandler implements IQueryHandler<GetQuizByIdQuery> {
  constructor(private repo: PairQuizGameRepository) {}

  async execute(query: GetQuizByIdQuery): Promise<any> {
    const game = await this.repo.getGameById(query.id, query.userId);
    if (!game) throw new NotFoundException();
    if (query.userId != game.player1Id || query.userId != game.player2Id)
      throw new ForbiddenException();
    return this.repo.getCurrentGameInfo(query.id);
  }
}
