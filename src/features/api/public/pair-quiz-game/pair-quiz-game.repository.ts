import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Question } from '../../../entities/entities/Question.entity';
import { QuizPair } from '../../../entities/entities/QuizPair.entity';

export class PairQuizGameRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async getExistingGame() {
    return this.dataSource
      .createQueryBuilder()
      .select('*')
      .from(QuizPair, 'qp')
      .where('qp.player2 is null')
      .getRawOne();
  }

  async createNewGame(userId: string) {}
  async startGame() {}
}
