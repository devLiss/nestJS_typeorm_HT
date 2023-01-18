import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizRepository } from '../quiz.repository';

export class DeleteQuestionCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeleteQuestionCommand)
export class DeleteQuestionHandler
  implements ICommandHandler<DeleteQuestionCommand>
{
  constructor(private repo: QuizRepository) {}

  execute(command: DeleteQuestionCommand): Promise<any> {
    return this.repo.delete(command.id);
  }
}
