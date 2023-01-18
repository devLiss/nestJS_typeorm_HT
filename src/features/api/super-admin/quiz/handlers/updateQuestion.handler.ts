import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Question } from '../../../../entities/entities/Question.entity';
import { QuizRepository } from '../quiz.repository';
import { CreateQuestionDto } from '../dto/createQuestion.dto';

export class UpdateQuestionCommand {
  constructor(public id: string, public cqDto: CreateQuestionDto) {}
}

@CommandHandler(UpdateQuestionCommand)
export class UpdateQuestionHandler
  implements ICommandHandler<UpdateQuestionCommand>
{
  constructor(private repo: QuizRepository) {}

  execute(command: UpdateQuestionCommand): Promise<any> {
    return this.repo.updateQuestion(command.id, command.cqDto);
  }
}
