import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PairQuizGameRepository } from '../pair-quiz-game.repository';
import { TopUsersDto } from '../dto/topUsers.dto';

export class GetTopUsersQuery {
  constructor(public tuDto: TopUsersDto) {}
}
@QueryHandler(GetTopUsersQuery)
export class GetTopUsersHandler implements IQueryHandler<GetTopUsersQuery> {
  constructor(private repo: PairQuizGameRepository) {}

  async execute(query: GetTopUsersQuery): Promise<any> {
    const { total, items } = await this.repo.getTopUsers(query.tuDto);
    return {
      pagesCount: Math.ceil(+total / query.tuDto.pageSize),
      page: +query.tuDto.pageNumber,
      pageSize: +query.tuDto.pageSize,
      totalCount: +total,
      items: items,
    };
  }
}
