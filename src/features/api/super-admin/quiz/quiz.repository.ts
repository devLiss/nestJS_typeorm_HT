import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Answer } from '../../../entities/entities/Answers.entity';
import { CreateQuestionDto } from './dto/createQuestion.dto';
import { QuizQueryDto } from './dto/quizQuery.dto';
import { Question } from '../../../entities/entities/Question.entity';

export class QuizRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async createQuestion(crDto: CreateQuestionDto) {
    const createQuestionQuery = `insert into questions (body) values ($1) returning *`;
    const createdQuestion = await this.dataSource.query(createQuestionQuery, [
      crDto.body,
    ]);

    const answArr = crDto.correctAnswers.map((item) => {
      return {
        answer: item,
        questionId: createdQuestion[0].id,
      };
    });

    const answers = await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(Answer)
      .values(answArr)
      .returning('answer')
      .execute();

    const correctAnswers = [];
    answers.raw.forEach((item) => {
      correctAnswers.push(Object.values(item)[0]);
    });
    return {
      id: createdQuestion[0].id,
      body: createdQuestion[0].body,
      correctAnswers: correctAnswers,
      published: false,
      createdAt: createdQuestion[0].createdAt,
      updatedAt: createdQuestion[0].updatedAt,
    };
  }

  async getAll(qqDto: QuizQueryDto) {
    const offset = (qqDto.pageNumber - 1) * qqDto.pageSize;
    const questionsQuery = `select q.*, array(select answer from answers a where "questionId" = q.id ) as "correctAnswers" 
            from questions q order by "${qqDto.sortBy}" ${qqDto.sortDirection} limit ${qqDto.pageSize} offset ${offset}`;

    const totalQuery = `select count(*) from questions q`;
    const questions = await this.dataSource.query(questionsQuery);
    const total = await this.dataSource.query(totalQuery);
    return {
      items: questions,
      total: total[0].count,
    };
  }
}
