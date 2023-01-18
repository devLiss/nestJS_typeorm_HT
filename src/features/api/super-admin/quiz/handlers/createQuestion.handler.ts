import { CreateQuestionDto } from '../dto/createQuestion.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizRepository } from '../quiz.repository';

export class CreateQuestionCommand {
  constructor(public cqDto: CreateQuestionDto) {}
}

@CommandHandler(CreateQuestionCommand)
export class CreateQuestionHandler
  implements ICommandHandler<CreateQuestionCommand>
{
  constructor(private repo: QuizRepository) {}

  execute(command: CreateQuestionCommand): Promise<any> {
    return this.repo.createQuestion(command.cqDto);
  }
}
