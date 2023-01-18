import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Answer } from './Answers.entity';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'boolean', default: false })
  published: boolean;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP()',
  })
  public createdAt: Date;

  /*@UpdateDateColumn({
    type: 'timestamp with time zone',
    onUpdate: 'CURRENT_TIMESTAMP()',
  })*/
  @Column({
    type: 'timestamp with time zone',
    default: null,
    onUpdate: 'CURRENT_TIMESTAMP()',
  })
  public updatedAt: Date;

  @OneToMany(() => Answer, (answer) => answer.questionId, {
    onDelete: 'CASCADE',
  })
  answers: Answer[];
}
