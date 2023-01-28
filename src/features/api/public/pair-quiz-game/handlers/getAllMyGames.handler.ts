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

    items.forEach((item) => {
      if (item.status == 'Finished') {
        const firstPlayer = item.firstPlayerProgress;
        const secondPlayer = item.secondPlayerProgress;

        const lastQuestionFP = new Date(
          firstPlayer.answers[firstPlayer.answers.length - 1].addedAt,
        ).getTime();
        const lastQuestionSp = new Date(
          secondPlayer.answers[secondPlayer.answers.length - 1].addedAt,
        ).getTime();
        if (
          lastQuestionFP < lastQuestionSp &&
          firstPlayer.answers.find((item) => item.answerStatus == 'Correct')
        ) {
          console.log('FP is WIN');
          item.firstPlayerProgress.score++;
        } else {
          if (
            secondPlayer.answers.find((item) => item.answerStatus == 'Correct')
          ) {
            item.secondPlayerProgress.score++;
          }
        }
      }
    });
    return {
      pagesCount: Math.ceil(+total / query.pagination.pageSize),
      page: query.pagination.pageNumber,
      pageSize: query.pagination.pageSize,
      totalCount: +total,
      items: items,
    };
  }
}
