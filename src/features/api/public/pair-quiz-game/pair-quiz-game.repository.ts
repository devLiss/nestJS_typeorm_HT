import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Not } from 'typeorm';
import { QuizPair } from '../../../entities/entities/QuizPair.entity';
import { Question } from '../../../entities/entities/Question.entity';
import { QuizProgress } from '../../../entities/entities/QuizProgress.entity';

export class PairQuizGameRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async getExistingGame(userId: string) {
    return this.dataSource.manager.findOne(QuizPair, {
      where: [
        { player2Id: userId, status: Not('Finished') },
        { player1Id: userId, status: Not('Finished') },
      ],
    });
  }

  async getCurrentGame(userId: string) {
    return this.dataSource.manager.findOne(QuizPair, {
      where: [
        { player2Id: userId, status: 'Active' },
        { player1Id: userId, status: 'Active' },
      ],
    });
  }

  async getProgressForCurrentGame(userId: string, gameId: string) {
    return this.dataSource.manager.count(QuizProgress, {
      where: {
        playerId: userId,
        gameId: gameId,
      },
    });
  }

  async checkAnswer(gameId: string, nextGameId: number) {
    const offset = nextGameId == 0 ? 0 : nextGameId - 1;
    return await this.dataSource.query(
      `select * from quiz_pair_questions_questions where "quizPairId" = '${gameId}' offset ${offset} limit 1`,
    );
  }
  async connectToGame(userId: string) {
    const connectToExistingGame = await this.dataSource
      .createQueryBuilder()
      .update(QuizPair)
      .set({
        player2Id: userId,
        status: 'Active',
        startGameDate: new Date(),
      })
      .where('player2Id is null')
      .returning('*')
      .execute();

    if (connectToExistingGame.affected < 1) {
      //TODO: найти решение с orderBy: random
      const questions = await this.dataSource.manager.find(Question, {
        take: 10,
      });

      const game = new QuizPair();
      game.status = 'PendingSecondPlayer';
      game.player1Id = userId;
      game.pairCreatedDate = new Date();
      game.questions = questions;

      return await this.dataSource.manager.save(game);
    }
  }
}
