import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { BearerAuthGuard } from '../../../../common/guards/bearerAuth.guard';
import { User } from '../../../../common/decorators/user.decorator';
import { CommandBus } from '@nestjs/cqrs';
import { ConnectToGameCommand } from './handlers/connectToGame.handler';
import { SendAnswerCommand } from './handlers/sendAnswer.handler';

@UseGuards(BearerAuthGuard)
@Controller('pair-game-quiz/pairs')
export class PairQuizGameController {
  constructor(private commandBus: CommandBus) {}

  @Get('my-current')
  async getMyCurrentGame() {}

  @Get(':id')
  async getGameById(@Param('id') id: string) {}

  @Post('connection')
  async connectToGame(@User() user) {
    return this.commandBus.execute(new ConnectToGameCommand(user.id));
  }

  @Post('my-current/answers')
  async sendAnswer(@Body('answer') answer: string) {
    return this.commandBus.execute(new SendAnswerCommand(answer));
  }
}
