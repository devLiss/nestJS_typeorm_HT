import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
import { DeleteQuestionCommand } from './handlers/deleteQuestion.handler';
import { PublishQuestionCommand } from './handlers/publishQuestion.handler';
import { UpdateQuestionCommand } from './handlers/updateQuestion.handler';

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
  @HttpCode(204)
  delete(@Param('id') id: string) {
    return this.commandBus.execute(new DeleteQuestionCommand(id));
  }

  @Put(':id')
  @HttpCode(204)
  update(@Param('id') id: string, @Body() cqDto: CreateQuestionDto) {
    return this.commandBus.execute(new UpdateQuestionCommand(id, cqDto));
  }

  @Put(':id/publish')
  @HttpCode(204)
  publish(@Param('id') id: string, @Body('published') published: boolean) {
    return this.commandBus.execute(new PublishQuestionCommand(id, published));
  }
}
