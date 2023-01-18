import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BasicAuthGuard } from '../../../../common/guards/basicAuth.guard';
import { QuizQueryDto } from './dto/quizQuery.dto';
import { CreateQuestionCommand } from './handlers/createQuestion.handler';
import { CreateQuestionDto } from './dto/createQuestion.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetAllQuestionsQuery } from './handlers/getAllQuestions.handler';

@UseGuards(BasicAuthGuard)
@Controller('sa/quiz/questions')
export class QuizController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}
  @Get()
  getAllQuestions(@Query() qqDto: QuizQueryDto) {
    return this.queryBus.execute(new GetAllQuestionsQuery(qqDto));
  }

  @Post()
  create(@Body() cqDto: CreateQuestionDto) {
    console.log(cqDto);
    return this.commandBus.execute(new CreateQuestionCommand(cqDto));
  }

  @Delete(':id')
  delete() {}

  @Put(':id')
  update() {}

  @Put(':id/publish')
  publish() {}
}
