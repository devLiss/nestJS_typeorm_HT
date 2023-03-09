import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PairQuizGameRepository } from './pair-quiz-game.repository';

@Injectable()
export class QuizGameService {
  constructor(private repo: PairQuizGameRepository) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async finishGames() {
    console.log('Cron finish Games');

    const res = await this.repo.getGameWhereOnePlayerFinished();

    for (let i = 0; i < res.length; i++) {
      const progressArr: Array<{
        playerId: string;
        gameId: string;
        questionId: string;
        answerStatus: string;
        addedAt: Date;
      }> = [];
      const data = res[i];
      console.log('DATA ', data);
      const questions = await this.repo.getQuestionsForGame(
        data.count2,
        data.gameId,
      );

      for (let j = 0; j < questions.length; j++) {
        progressArr.push({
          playerId: data.player2Id,
          gameId: data.gameId,
          questionId: questions[j].questionsId,
          answerStatus: 'Incorrect',
          addedAt: new Date()
        });
      }

      console.log(await this.repo.updateProgressForFinish(progressArr));
      await this.repo.finishGame(data.gameId);
    }
  }
}
