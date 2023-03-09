import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BearerAuthGuard } from '../../../../common/guards/bearerAuth.guard';
import { User } from '../../../../common/decorators/user.decorator';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ConnectToGameCommand } from './handlers/connectToGame.handler';
import { SendAnswerCommand } from './handlers/sendAnswer.handler';
import { GetQuizByIdQuery } from './handlers/getQuizById.handler';
import { GetCurrentGameQuery } from './handlers/getCurrentGame.handler';
import { GetGameByIdDto } from './dto/getGameById.dto';
import { PaginatingQueryDto } from '../../bloggers/blogs/dto/paginatingQuery.dto';
import { GetAllMyGamesQuery } from './handlers/getAllMyGames.handler';
import { GetMyStatisticQuery } from './handlers/getMyStatistic.handler';
import { TopUsersDto } from './dto/topUsers.dto';
import { GetTopUsersQuery } from './handlers/getTopUsers.handler';
import { QuizGameService } from './quiz-game.service';

@UseGuards(BearerAuthGuard)
@Controller('pair-game-quiz')
export class PairQuizGameController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @Get('my')
  async getMyAllGames(@User() user, @Query() p: PaginatingQueryDto) {
    return this.queryBus.execute(new GetAllMyGamesQuery(user.id, p));
  }
  @Get('pairs/my-current')
  async getMyCurrentGame(@User() user) {
    console.log('My current');
    console.log(user);
    return this.queryBus.execute(new GetCurrentGameQuery(user.id));
  }

  @Get('pairs/:id')
  async getGameById(@Param() ggDto: GetGameByIdDto, @User() user) {
    return this.queryBus.execute(
      new GetQuizByIdQuery(
        ggDto.id,
        user.id
      ),
    );
  }

  @HttpCode(200)
  @Post('pairs/connection')
  async connectToGame(@User() user) {
    console.log('connectToGame');
    return this.commandBus.execute(new ConnectToGameCommand(user));
  }

  @HttpCode(200)
  @Post('pairs/my-current/answers')
  async sendAnswer(@Body('answer') answer: string, @User() user) {
    return this.commandBus.execute(new SendAnswerCommand(answer, user.id));
  }
}
