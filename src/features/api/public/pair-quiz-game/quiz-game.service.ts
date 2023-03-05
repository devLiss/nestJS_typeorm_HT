import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PairQuizGameRepository } from './pair-quiz-game.repository';

@Injectable()
export class QuizGameService {
  constructor(private repo: PairQuizGameRepository) {}

  @Cron('*/5 * * * * *')
  async finishGames() {
    console.log('Cron finish Games');

    const res = await this.repo.getGameWhereOnePlayerFinished();

    for (let i = 0; i < res.length; i++) {
      const progressArr: Array<{
        playerId: string;
        gameId: string;
        questionId: string;
        answerStatus: string;
      }> = [];
      const data = res[i];
      console.log('DATA ', data);
      const questions = await this.repo.getQuestionsForGame(
        data.count,
        data.gameId,
      );

      for (let j = 0; j < questions.length; j++) {
        progressArr.push({
          playerId: data.player,
          gameId: data.gameId,
          questionId: questions[j].questionsId,
          answerStatus: 'Incorrect',
        });
      }

      await this.repo.updateProgressForFinish(progressArr);
      await this.repo.finishGame(data.gameId)
    }
  }
}