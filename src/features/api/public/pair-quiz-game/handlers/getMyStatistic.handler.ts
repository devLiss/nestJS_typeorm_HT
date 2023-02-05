import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PairQuizGameRepository } from '../pair-quiz-game.repository';

export class GetMyStatisticQuery {
  constructor(public userId: string) {}
}

@QueryHandler(GetMyStatisticQuery)
export class GetMyStatisticHandler
  implements IQueryHandler<GetMyStatisticQuery>
{
  constructor(private repo: PairQuizGameRepository) {}

  async execute(query: GetMyStatisticQuery): Promise<any> {
    const statistic = await this.repo.getMyStatistic(query.userId);
    console.log(statistic);
    return statistic;
  }
}
