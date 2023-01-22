import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Not } from 'typeorm';
import { QuizPair } from '../../../entities/entities/QuizPair.entity';
import { Question } from '../../../entities/entities/Question.entity';

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
