import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PairQuizGameRepository } from '../pair-quiz-game.repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

export class GetQuizByIdQuery {
  constructor(public id: string, public userId: string) {}
}

@QueryHandler(GetQuizByIdQuery)
export class GetQuizByIdHandler implements IQueryHandler<GetQuizByIdQuery> {
  constructor(private repo: PairQuizGameRepository) {}

  async execute(query: GetQuizByIdQuery): Promise<any> {
    const game = await this.repo.getGameById(query.id, query.userId);
    console.log(game);
    if (!game) throw new NotFoundException();
    if (query.userId != game.player1Id && query.userId != game.player2Id)
      throw new ForbiddenException();

    const findedGame = await this.repo.getCurrentGameInfo(query.id);
    if (findedGame && findedGame.status == 'Finished') {
      const firstPlayer = findedGame.firstPlayerProgress;
      const secondPlayer = findedGame.secondPlayerProgress;

      const lastQuestionFP = new Date(
        firstPlayer.answers[firstPlayer.answers.length - 1].addedAt,
      ).getTime();
      const lastQuestionSp = new Date(
        secondPlayer.answers[secondPlayer.answers.length - 1].addedAt,
      ).getTime();
      if (
        lastQuestionFP > lastQuestionSp &&
        firstPlayer.answers.find((item) => item.answerStatus == 'Correct')
      ) {
        console.log('FP is WIN');
        findedGame.firstPlayerProgress.score++;
      } else {
        if (
          secondPlayer.answers.find((item) => item.answerStatus == 'Correct')
        ) {
          findedGame.secondPlayerProgress.score++;
        }
      }
    }
    return findedGame;
  }
}
