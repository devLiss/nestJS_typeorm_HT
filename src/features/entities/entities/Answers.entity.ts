import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from './Question.entity';

@Entity('answers')
export class Answer extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'text' })
  answer: string;
  @Column({ type: 'uuid' })
  questionId: string;

  @ManyToOne(() => Question, (question) => question.id, { cascade: true })
  question: Question;
}
