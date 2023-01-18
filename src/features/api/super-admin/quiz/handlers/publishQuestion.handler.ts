import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizRepository } from '../quiz.repository';
import { NotFoundException } from '@nestjs/common';

export class PublishQuestionCommand {
  constructor(public id: string, public published: boolean) {}
}
@CommandHandler(PublishQuestionCommand)
export class PublishQuestionHandler
  implements ICommandHandler<PublishQuestionCommand>
{
  constructor(private repo: QuizRepository) {}

  async execute(command: PublishQuestionCommand): Promise<any> {
    const question = await this.repo.getOne(command.id);
    if (!question) throw new NotFoundException();
    return this.repo.publishQuestion(command.id, command.published);
  }
}
