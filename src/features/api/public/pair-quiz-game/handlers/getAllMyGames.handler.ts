import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PairQuizGameRepository } from '../pair-quiz-game.repository';
import { PaginatingQueryDto } from '../../../bloggers/blogs/dto/paginatingQuery.dto';

export class GetAllMyGamesQuery {
  constructor(public userId: string, public pagination: PaginatingQueryDto) {}
}

@QueryHandler(GetAllMyGamesQuery)
export class GetAllMyGamesHandler implements IQueryHandler<GetAllMyGamesQuery> {
  constructor(private repo: PairQuizGameRepository) {}

  async execute(query: GetAllMyGamesQuery): Promise<any> {
    const { items, total } = await this.repo.getMyGamesInfo(
      query.userId,
      query.pagination,
    );
    return {
      pagesCount: Math.ceil(+total / query.pagination.pageSize),
      page: query.pagination.pageNumber,
      pageSize: query.pagination.pageSize,
      totalCount: +total,
      items: items,
    };
  }
}
