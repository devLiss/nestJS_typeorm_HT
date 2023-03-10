import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { TopUsersDto } from './dto/topUsers.dto';
import { GetTopUsersQuery } from './handlers/getTopUsers.handler';
import { User } from '../../../../common/decorators/user.decorator';
import { GetMyStatisticQuery } from './handlers/getMyStatistic.handler';
import { QuizGameService } from './quiz-game.service';

@Controller('pair-game-quiz/users')
export class QuizStatisticsController {
  constructor(private queryBus: QueryBus, private service: QuizGameService) {}

  @Get('top')
  async getTop(@Query() tuDto: TopUsersDto) {
    if (typeof tuDto.sort === 'string') {
      tuDto.sort = [tuDto.sort];
    }
    return this.queryBus.execute(new GetTopUsersQuery(tuDto));
  }
  @Get('my-statistic')
  async getMyStatistic(@User() user) {
    return this.queryBus.execute(new GetMyStatisticQuery(user.id));
  }
  @Get('cron')
  async runCron() {
    return this.service.finishGames();
  }
}
