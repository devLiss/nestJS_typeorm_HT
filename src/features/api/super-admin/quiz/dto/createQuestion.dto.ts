import { IsArray, IsString } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  body: string;

  @IsArray()
  correctAnswers: Array<string>;
}
