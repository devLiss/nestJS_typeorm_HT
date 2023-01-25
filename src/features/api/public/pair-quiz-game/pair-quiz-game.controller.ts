import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BearerAuthGuard } from '../../../../common/guards/bearerAuth.guard';
import { User } from '../../../../common/decorators/user.decorator';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ConnectToGameCommand } from './handlers/connectToGame.handler';
import { SendAnswerCommand } from './handlers/sendAnswer.handler';
import { GetQuizByIdQuery } from './handlers/getQuizById.handler';
import { GetCurrentGameQuery } from './handlers/getCurrentGame.handler';

@UseGuards(BearerAuthGuard)
@Controller('pair-game-quiz/pairs')
export class PairQuizGameController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @Get('my-current')
  async getMyCurrentGame(@User() user) {
    return this.queryBus.execute(new GetCurrentGameQuery(user.id));
  }

  @Get(':id')
  async getGameById(@Param('id') id: string, @User() user) {
    return this.queryBus.execute(new GetQuizByIdQuery(id, user.id));
  }

  @HttpCode(200)
  @Post('connection')
  async connectToGame(@User() user) {
    console.log('connectToGame');
    return this.commandBus.execute(new ConnectToGameCommand(user.id));
  }
  @HttpCode(200)
  @Post('my-current/answers')
  async sendAnswer(@Body('answer') answer: string, @User() user) {
    return this.commandBus.execute(new SendAnswerCommand(answer, user.id));
  }
}
