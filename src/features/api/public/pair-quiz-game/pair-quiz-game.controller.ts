import { Controller, Get, Param, Post } from '@nestjs/common';

@Controller('pair-quiz-game')
export class PairQuizGameController {
  @Get('my-current')
  async getMyCurrentGame() {}

  @Get(':id')
  async getGameById(@Param('id') id: string) {}

  @Post('connection')
  async connectToGame() {}

  @Post('my-current/answers')
  async sendAnswer() {}
}
