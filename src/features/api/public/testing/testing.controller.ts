import { Controller, Delete, Get, HttpCode } from '@nestjs/common';
import { UserSqlRepository } from '../../../entities/postgres/userSql.repository';
import { SessionsSqlRepository } from '../../../entities/postgres/sessionsSql.repository';
import { BlogsSqlRepository } from '../../../entities/postgres/blogsSql.repository';
import { PostSqlRepository } from '../../../entities/postgres/postSql.repository';
import { QuizRepository } from '../../super-admin/quiz/quiz.repository';
import { PairQuizGameRepository } from '../pair-quiz-game/pair-quiz-game.repository';

@Controller('testing')
export class TestingController {
  constructor(
    private userRepo: UserSqlRepository,
    private sessionRepo: SessionsSqlRepository,
    private blogRepo: BlogsSqlRepository,
    private postRepo: PostSqlRepository,
    private quizRepo: QuizRepository,
    private quizPairRepo: PairQuizGameRepository,
  ) {}

  @Delete('all-data')
  @HttpCode(204)
  async deleteAllData() {
    await this.sessionRepo.deleteAll();
    await this.userRepo.deleteAll();
    await this.blogRepo.deleteAll();
    await this.postRepo.deleteAll();
    await this.quizRepo.deleteAll();
    await this.quizPairRepo.deleteAll();
  }
}
