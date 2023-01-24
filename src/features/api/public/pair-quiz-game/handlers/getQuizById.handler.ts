import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PairQuizGameRepository } from '../pair-quiz-game.repository';

export class GetQuizByIdQuery {
  constructor(public id: string, public userId: string) {}
}

@QueryHandler(GetQuizByIdQuery)
export class GetQuizByIdHandler implements IQueryHandler<GetQuizByIdQuery> {
  constructor(private repo: PairQuizGameRepository) {}

  execute(query: GetQuizByIdQuery): Promise<any> {
    return this.repo.getCurrentGameInfo(query.id);
  }
}
