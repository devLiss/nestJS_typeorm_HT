import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PairQuizGameRepository } from './pair-quiz-game.repository';

@Injectable()
export class QuizGameService {
  constructor(private repo: PairQuizGameRepository) {}

  // @Cron(CronExpression.EVERY_5_SECONDS)
  async finishGames() {
    console.log('Cron finish Games');

    const res = await this.repo.getGameWhereOnePlayerFinished();
    console.log(res);
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

      let c = data.count;
      let player = data.player1Id;

      if (data.count2 === 5) {
        c = data.count2;
        player = data.player2Id;
      }

      const questions = await this.repo.getQuestionsForGame(c, data.gameId);

      for (let j = 0; j < questions.length; j++) {
        progressArr.push({
          playerId: player,
          gameId: data.gameId,
          questionId: questions[j].questionsId,
          answerStatus: 'Incorrect',
          addedAt: new Date(),
        });
      }
      console.log(progressArr);
      console.log(await this.repo.updateProgressForFinish(progressArr));
      await this.repo.finishGame(data.gameId);
    }
  }
}
