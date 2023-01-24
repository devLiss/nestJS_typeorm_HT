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
      relations: ['questions'],
      where: [
        { player2Id: userId, status: 'Active' },
        { player1Id: userId, status: 'Active' },
      ],
    });
  }

  async getProgressForCurrentGame(userId: string, gameId: string) {
    console.log(userId, '  ==> ', gameId);
    return this.dataSource.manager.count(QuizProgress, {
      where: {
        playerId: userId,
        gameId: gameId,
      },
    });
  }

  async getCurrentQuestion(gameId: string, nextGameId: number) {
    const offset = nextGameId == 0 ? 0 : nextGameId - 1;
    const currentQuestion = await this.dataSource.query(
      `select * from quiz_pair_questions_questions where "quizPairId" = '${gameId}' offset ${offset} limit 1`,
    );
    return currentQuestion ? currentQuestion[0] : null;
  }
  async getProgress(gameId: string, userId: string) {
    return this.dataSource.manager.find(QuizProgress, {
      where: {
        gameId: gameId,
        playerId: userId,
      },
    });
  }
  async getCorrectAnswers(questionId: string) {
    return this.dataSource.manager.findOne(Question, {
      where: { id: questionId },
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

  async updateProgress(
    userId: string,
    gameId: string,
    questionId: string,
    status: string,
  ) {
    const userProgress = new QuizProgress();
    userProgress.gameId = gameId;
    userProgress.playerId = userId;
    userProgress.questionId = questionId;
    userProgress.answerStatus = status;
    userProgress.addedAt = new Date();

    return this.dataSource.manager.save(userProgress);
    /*await this.dataSource.manager.findOne(QuizProgress, { where: {
        gameId: gameId,
        playerId: userId,
      }
    })*/
  }

  async getCurrentGameInfo(gameId: string) {
    const query = `
      select qp.id, qp.status, qp."pairCreatedDate", qp."startGameDate" , qp."finishGameDate", 
      (select array_to_json(array_agg( row_to_json(t))) from (select q.id, q.body from questions q 
      left join quiz_pair_questions_questions qpqq on q.id = qpqq."questionsId" where qpqq."quizPairId" = '${gameId}') t) as questions,
      (select row_to_json(x3)  from (select * from
      (select array_to_json(array_agg( row_to_json(t1))) as answers from (
      select qpr."questionId", qpr."answerStatus", qpr."addedAt" from quiz_progress qpr where "playerId" = qp."player1Id") t1) as "answers",
      (select row_to_json(t2) as player from (select id, login from users u where id = qp."player1Id") t2) as "player",
      (select count(*) as "score" from quiz_progress qpr where "playerId" = qp."player1Id" and "answerStatus" = 'Correct') as "score"
       )x3) as "firstPlayerProgress", 
      (select row_to_json(x3)  from (select * from
      (select array_to_json(array_agg( row_to_json(t1))) as answers from (
      select qpr."questionId", qpr."answerStatus", qpr."addedAt" from quiz_progress qpr where "playerId" = qp."player2Id") t1) as "answers",
      (select row_to_json(t2) as player from (select id, login from users u where id = qp."player2Id") t2) as "player",
      (select count(*) as "score" from quiz_progress qpr where "playerId" = qp."player2Id" and "answerStatus" = 'Correct') as "score"
       )x3) as "secondPlayerProgress"
      
      from quiz_pair qp`;

    return this.dataSource.query(query);
  }
}