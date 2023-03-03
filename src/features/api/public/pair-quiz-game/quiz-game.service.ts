import { Injectable } from '@nestjs/common';
import {Cron, CronExpression} from '@nestjs/schedule';
import { PairQuizGameRepository } from './pair-quiz-game.repository';

@Injectable()
export class QuizGameService {
  constructor(private repo: PairQuizGameRepository) {}

  @Cron('*/5 * * * * *')
  finishGames() {
    console.log('Cron finish Games');


  }
}
