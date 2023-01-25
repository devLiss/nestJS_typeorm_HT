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
import { GetGameByIdDto } from './dto/getGameById.dto';

@UseGuards(BearerAuthGuard)
@Controller('pair-game-quiz/pairs')
export class PairQuizGameController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @Get('my-current')
  async getMyCurrentGame(@User() user) {
    console.log('My current');
    console.log(user);
    return this.queryBus.execute(new GetCurrentGameQuery(user.id));
  }

  @Get(':id')
  async getGameById(@Param() ggDto: GetGameByIdDto, @User() user) {
    return this.queryBus.execute(new GetQuizByIdQuery(ggDto.id, user.id));
  }

  @HttpCode(200)
  @Post('connection')
  async connectToGame(@User() user) {
    console.log('connectToGame');
    return this.commandBus.execute(new ConnectToGameCommand(user));
  }

  @HttpCode(200)
  @Post('my-current/answers')
  async sendAnswer(@Body('answer') answer: string, @User() user) {
    return this.commandBus.execute(new SendAnswerCommand(answer, user.id));
  }
}
