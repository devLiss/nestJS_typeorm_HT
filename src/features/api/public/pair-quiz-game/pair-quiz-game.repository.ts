import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, IsNull, Not } from 'typeorm';
import { QuizPair } from '../../../entities/entities/QuizPair.entity';
import { Question } from '../../../entities/entities/Question.entity';
import { QuizProgress } from '../../../entities/entities/QuizProgress.entity';
import { PaginatingQueryDto } from '../../bloggers/blogs/dto/paginatingQuery.dto';
import { TopUsersDto } from './dto/topUsers.dto';

export class PairQuizGameRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async getExistingGame(userId: string) {
    return this.dataSource.query(
      `select * from quiz_pair where ("player1Id" = '${userId}' or "player2Id" = '${userId}') and status != 'Finished'`,
    );
    /*return this.dataSource.manager.findOne(QuizPair, {
      where: [
        { player1Id: userId, status: Not('Finished') },
        { player2Id: userId, status: Not('Finished') },
      ],
    });*/
  }
  async getCurrentGame(userId: string) {
    console.log(userId);
    const query = `select qp.*, (select array_to_json(array_agg( row_to_json(t))) from (select q.id, q.body from questions q
    left join quiz_pair_questions_questions qpqq on q.id = qpqq."questionsId" where qpqq."quizPairId" = qp.id ) t) as "questions"
    from quiz_pair qp where ("player1Id" = '${userId}' or "player2Id" = '${userId}') and status = 'Active'`;
    const game = await this.dataSource.query(query);
    console.log('QUERY ', query);
    console.log('GAME result', game);
    return game ? game[0] : null;
    /*this.dataSource.manager.findOne(QuizPair, {
      where: [
        { player2Id: userId, status: 'Active' },
        { player1Id: userId, status: 'Active' },
      ],
      relations: ['questions'],
    });*/
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
    const offset = nextGameId == 0 ? 0 : nextGameId;
    const query = `select * from quiz_pair_questions_questions where "quizPairId" = '${gameId}' offset ${offset} limit 1`;
    console.log(query);
    const currentQuestion = await this.dataSource.query(query);
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
    const questions = await this.dataSource.manager.find(Question, {
      where: {
        published: true,
      },
      take: 5,
    });

    const connectToExistingGame = await this.dataSource.manager.findOne(
      QuizPair,
      {
        where: {
          status: 'PendingSecondPlayer',
        },
      },
    );

    console.log('connectToExistingGame  ==> ', connectToExistingGame);
    if (connectToExistingGame) {
      connectToExistingGame.player2Id = userId;
      connectToExistingGame.status = 'Active';
      connectToExistingGame.startGameDate = new Date();
      connectToExistingGame.questions = questions;
      const t = await this.dataSource.manager.save(connectToExistingGame);
      console.log('t => ', t);
      return this.getCurrentGameInfo(t.id);
    } else {
      const game = new QuizPair();
      game.status = 'PendingSecondPlayer';
      game.player1Id = userId;
      game.pairCreatedDate = new Date();
      const tt = await this.dataSource.manager.save(game);
      console.log('tt => ', tt);
      return this.getCurrentGameInfo(tt.id);
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
  }

  async updateProgressForFinish(
    progress: Array<{
      userId: string;
      gameId: string;
      questionId: string;
      status: string;
    }>,
  ) {
    return this.dataSource
      .createQueryBuilder()
      .insert()
      .into(QuizProgress)
      .values(progress)
      .execute();
  }

  async getGameById(gameId: string, userId: string) {
    return this.dataSource.manager.findOne(QuizPair, {
      where: {
        id: gameId,
      },
    });
  }
  async getCurrentGameInfo(gameId: string) {
    console.log('gameId ==> ', gameId);
    const query = `
      select qp.id, qp.status, qp."pairCreatedDate", qp."startGameDate" , qp."finishGameDate", 
      (select array_to_json(array_agg( row_to_json(t))) from (select q.id, q.body from questions q 
      left join quiz_pair_questions_questions qpqq on q.id = qpqq."questionsId" where qpqq."quizPairId" = '${gameId}') t) as questions,
      (select row_to_json(x3)  from (select * from
      (select coalesce( array_to_json(array_agg( row_to_json(t1))),'[]')  as answers from (
      select qpr."questionId", qpr."answerStatus", to_char (qpr."addedAt"::timestamp with time zone at time zone 'Etc/UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as "addedAt" from quiz_progress qpr where "playerId" = qp."player1Id" and "gameId" = '${gameId}' order by qpr."addedAt" asc) t1) as "answers",
      (select row_to_json(t2) as player from (select id, login from users u where id = qp."player1Id") t2) as "player",
      (select count(*) as "score" from quiz_progress qpr where "playerId" = qp."player1Id" and "answerStatus" = 'Correct'  and "gameId" = '${gameId}') as "score"
       )x3) as "firstPlayerProgress", 
      (select row_to_json(x3)  from (select * from
      (select coalesce( array_to_json(array_agg( row_to_json(t1))),'[]') as answers from (
      select qpr."questionId", qpr."answerStatus",to_char (qpr."addedAt"::timestamp with time zone at time zone 'Etc/UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as "addedAt" from quiz_progress qpr where "playerId" = qp."player2Id" and "gameId" = '${gameId}' order by qpr."addedAt" asc) t1) as "answers",
      (select row_to_json(t2) as player from (select id, login from users u where id = qp."player2Id") t2) as "player",
      (select count(*) as "score" from quiz_progress qpr where "playerId" = qp."player2Id" and "answerStatus" = 'Correct'  and "gameId" = '${gameId}') as "score"
       )x3) as "secondPlayerProgress"
      
      from quiz_pair qp where id = '${gameId}'`;

    const result = await this.dataSource.query(query);
    return result ? result[0] : null;
  }
  async getMyGamesInfo(userId: string, pagination: PaginatingQueryDto) {
    const offset = (pagination.pageNumber - 1) * pagination.pageSize;
    const orderBy =
      pagination.sortBy != 'createdAt'
        ? `"${pagination.sortBy}" COLLATE "C"`
        : `qp."pairCreatedDate"`;
    const query = `select qp.id, qp.status, qp."pairCreatedDate", qp."startGameDate" , qp."finishGameDate", 
      (select array_to_json(array_agg( row_to_json(t))) from (select q.id, q.body from questions q 
      left join quiz_pair_questions_questions qpqq on q.id = qpqq."questionsId" where qpqq."quizPairId" = qp."id") t) as questions,
      (select row_to_json(x3)  from (select * from
      (select coalesce( array_to_json(array_agg( row_to_json(t1))),'[]')  as answers from (
      select qpr."questionId", qpr."answerStatus", to_char (qpr."addedAt"::timestamp with time zone at time zone 'Etc/UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as "addedAt" from quiz_progress qpr where "playerId" = qp."player1Id" and "gameId" = qp."id" order by qpr."addedAt" asc) t1) as "answers",
      (select row_to_json(t2) as player from (select id, login from users u where id = qp."player1Id") t2) as "player",
      (select count(*) as "score" from quiz_progress qpr where "playerId" = qp."player1Id" and "answerStatus" = 'Correct'  and "gameId" = qp."id") as "score"
       )x3) as "firstPlayerProgress", 
      (select row_to_json(x3)  from (select * from
      (select coalesce( array_to_json(array_agg( row_to_json(t1))),'[]') as answers from (
      select qpr."questionId", qpr."answerStatus",to_char (qpr."addedAt"::timestamp with time zone at time zone 'Etc/UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as "addedAt" from quiz_progress qpr where "playerId" = qp."player2Id" and "gameId" = qp."id" order by qpr."addedAt" asc) t1) as "answers",
      (select row_to_json(t2) as player from (select id, login from users u where id = qp."player2Id") t2) as "player",
      (select count(*) as "score" from quiz_progress qpr where "playerId" = qp."player2Id" and "answerStatus" = 'Correct'  and "gameId" = qp."id") as "score"
       )x3) as "secondPlayerProgress"
      
      from quiz_pair qp where ("player1Id" = '${userId}' or "player2Id" = '${userId}') and status in ('Active', 'Finished') order by ${orderBy} ${pagination.sortDirection} limit ${pagination.pageSize} offset ${offset}`;

    const items = await this.dataSource.query(query);

    const total = await this.dataSource.query(
      `select count(*) from quiz_pair qp where ("player1Id" = '${userId}' or "player2Id" = '${userId}') and status in ('Active', 'Finished')`,
    );

    return { items: items, total: total[0].count };
  }
  async getOtherPlayerProgress(gameId: string, userId: string) {
    const query = `select count(*) from quiz_progress where "gameId"='${gameId}' and "playerId" != '${userId}'`;
    return this.dataSource.query(query);
  }
  async finishGame(gameId: string) {
    const game = await this.dataSource.manager.findOne(QuizPair, {
      where: { id: gameId },
    });

    game.finishGameDate = new Date();
    game.status = 'Finished';

    return await this.dataSource.manager.save(game);
  }
  async getGameByUId(userId: string) {
    return this.dataSource.query(
      `select * from quiz_pair where ("player1Id" = '${userId}' or "player2Id" = '${userId}')`,
    );
  }

  async getMyStatistic(userId: string) {
    const res = await this.dataSource.createQueryBuilder().select('sum(score)');
    const query = `select sum(score) as "sumScore", round (avg(score)::numeric, 2) as "avgScores", count(*) as "gamesCount",
 (select count(*) from score where "player" = $1 and winner = 1)as "winsCount",
  (select count(*) from score where "player" = $1 and winner = 0)as "lossesCount",
  (select count(*) from score where "player" = $1 and winner = -1)as "drawsCount"
from score s 
where "player" = $1   
`;
    const result = await this.dataSource.query(query, [userId]);
    return {
      sumScore: result[0].sumScore ?? 0,
      avgScores: result[0].avgScores ?? 0,
      gamesCount: +result[0].gamesCount,
      winsCount: +result[0].winsCount,
      lossesCount: +result[0].lossesCount,
      drawsCount: +result[0].drawsCount,
    };
  }

  async getTopUsers(tuDto: TopUsersDto) {
    const offset = (tuDto.pageNumber - 1) * tuDto.pageSize;
    //const orderBy = tuDto.sort.join(',');
    const tArr = tuDto.sort.map((item) => {
      const tt = item.split(' ');
      return `"${tt[0]}" ${tt[1]}`;
    });
    const orderBy = tArr.join(',');
    console.log(orderBy);
    const query = `select  count(*) as "gamesCount", 
       (select count(*) from score where  player = u.id and winner = 1) as "winsCount",
       (select count(*) from score where player = u.id and winner = 0) as "lossesCount",
       (select count(*) from score where player = u.id and winner = -1) as "drawsCount",
       sum(score) as "sumScore", round (avg(score)::numeric, 2)  as "avgScores",
       json_build_object('id', u.id , 'login',u.login) as "player"
      from score s left join users u on s.player = u.id group by u.id order by ${orderBy} limit $1 offset $2
      `;
    console.log(query);
    const result = await this.dataSource.query(query, [tuDto.pageSize, offset]);

    const temp = result.map((item) => {
      return {
        gamesCount: +item.gamesCount,
        winsCount: +item.winsCount,
        lossesCount: +item.lossesCount,
        drawsCount: +item.drawsCount,
        sumScore: +item.sumScore,
        avgScores: +item.avgScores,
        player: item.player,
      };
    });
    const totalQuery = `select count(*) over ()
      from score s left join users u on s.player = u.id group by u.id limit 1`;

    const totalResult = await this.dataSource.query(totalQuery);
    return { total: totalResult[0].count, items: temp };
  }
  async deleteAll() {
    await this.dataSource.query(`delete from quiz_progress`);
    return this.dataSource.query(`delete from quiz_pair cascade`);
  }
}
