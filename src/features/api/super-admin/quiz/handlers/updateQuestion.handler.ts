import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Question } from '../../../../entities/entities/Question.entity';
import { QuizRepository } from '../quiz.repository';
import { CreateQuestionDto } from '../dto/createQuestion.dto';
import { NotFoundException } from '@nestjs/common';

export class UpdateQuestionCommand {
  constructor(public id: string, public cqDto: CreateQuestionDto) {}
}

@CommandHandler(UpdateQuestionCommand)
export class UpdateQuestionHandler
  implements ICommandHandler<UpdateQuestionCommand>
{
  constructor(private repo: QuizRepository) {}

  async execute(command: UpdateQuestionCommand): Promise<any> {
    const question = await this.repo.getOne(command.id);
    if (!question) throw new NotFoundException();
    return this.repo.updateQuestion(command.id, command.cqDto);
  }
}
