import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizRepository } from '../quiz.repository';

export class PublishQuestionCommand {
  constructor(public id: string, public published: boolean) {}
}
@CommandHandler(PublishQuestionCommand)
export class PublishQuestionHandler
  implements ICommandHandler<PublishQuestionCommand>
{
  constructor(private repo: QuizRepository) {}

  execute(command: PublishQuestionCommand): Promise<any> {
    return this.repo.publishQuestion(command.id, command.published);
  }
}
