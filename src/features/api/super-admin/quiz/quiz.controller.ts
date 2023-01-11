import {
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

@UseGuards(BasicAuthGuard)
@Controller('sa/quiz/questions')
export class QuizController {
  @Get()
  getAllQuestions(@Query() qqDto: QuizQueryDto) {}

  @Post()
  create() {}

  @Delete(':id')
  delete() {}

  @Put(':id')
  update() {}

  @Put(':id/publish')
  publish() {}
}
