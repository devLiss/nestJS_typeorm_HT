import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { QuizRepository } from '../quiz.repository';
import { QuizQueryDto } from '../dto/quizQuery.dto';

export class GetAllQuestionsQuery {
  constructor(public qqDto: QuizQueryDto) {}
}

@QueryHandler(GetAllQuestionsQuery)
export class GetAllQuestionsHandler
  implements IQueryHandler<GetAllQuestionsQuery>
{
  constructor(private repo: QuizRepository) {}

  async execute(query: GetAllQuestionsQuery): Promise<any> {
    const { items, total } = await this.repo.getAll(query.qqDto);
    return {
      pagesCount: Math.ceil(+total / query.qqDto.pageSize),
      page: query.qqDto.pageNumber,
      pageSize: query.qqDto.pageSize,
      totalCount: +total,
      items: items,
    };
  }
}
