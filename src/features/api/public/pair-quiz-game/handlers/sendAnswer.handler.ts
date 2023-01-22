import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PairQuizGameRepository } from '../pair-quiz-game.repository';

export class SendAnswerCommand {
  constructor(public answer: string) {}
}

@CommandHandler(SendAnswerCommand)
export class SendAnswerHandler implements ICommandHandler<SendAnswerCommand> {
  constructor(private repo: PairQuizGameRepository) {}

  execute(command: SendAnswerCommand): Promise<any> {
    return Promise.resolve(undefined);
  }
}
