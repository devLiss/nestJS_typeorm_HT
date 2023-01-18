import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizRepository } from '../quiz.repository';
import { NotFoundException } from '@nestjs/common';

export class DeleteQuestionCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeleteQuestionCommand)
export class DeleteQuestionHandler
  implements ICommandHandler<DeleteQuestionCommand>
{
  constructor(private repo: QuizRepository) {}

  async execute(command: DeleteQuestionCommand): Promise<any> {
    const question = await this.repo.getOne(command.id);
    if (!question) throw new NotFoundException();
    return this.repo.delete(command.id);
  }
}
