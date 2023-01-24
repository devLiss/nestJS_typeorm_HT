import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PairQuizGameRepository } from '../pair-quiz-game.repository';

export class SendAnswerCommand {
  constructor(public answer: string, public userId: string) {}
}

@CommandHandler(SendAnswerCommand)
export class SendAnswerHandler implements ICommandHandler<SendAnswerCommand> {
  constructor(private repo: PairQuizGameRepository) {}

  async execute(command: SendAnswerCommand): Promise<any> {
    const currentGame = await this.repo.getCurrentGame(command.userId);
    //console.log(currentGame);

    const check = await this.repo.checkAnswer(currentGame.id, 0);
    console.log(check);
    return Promise.resolve(undefined);
  }
}
