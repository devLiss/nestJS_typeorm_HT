import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Answer } from '../../../entities/entities/Answers.entity';
import { CreateQuestionDto } from './dto/createQuestion.dto';

export class QuizRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async createQuestion(crDto: CreateQuestionDto) {
    const createQuestionQuery = `insert into questions (body) values ($1) returning id`;
    const createdQuestion = await this.dataSource.query(createQuestionQuery, [
      crDto.body,
    ]);

    const answArr = crDto.correctAnswers.map((item) => {
      return {
        answer: item,
        questionId: createdQuestion[0].id,
      };
    });
    /*const createAnswersPool = `insert into answers ("answer", "questionId") values ($1, $2) `;
    const createdAnswers = await this.dataSource.query(createAnswersPool);*/
    /*Answer.create(answArr);
    Answer.insert();*/
  }
}
