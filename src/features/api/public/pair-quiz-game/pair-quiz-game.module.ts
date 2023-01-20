import { Module } from '@nestjs/common';
import { PairQuizGameController } from './pair-quiz-game.controller';

@Module({
  controllers: [PairQuizGameController]
})
export class PairQuizGameModule {}
