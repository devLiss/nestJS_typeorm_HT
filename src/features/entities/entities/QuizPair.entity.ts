import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { QuizProgress } from './QuizProgress.entity';
import { Question } from './Question.entity';

@Entity()
export class QuizPair {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  player1Id: string;

  @Column({ type: 'uuid', nullable: true })
  player2Id: string;

  @Column({ type: 'text' })
  status: string;

  @Column({ type: 'timestamp with time zone' })
  pairCreatedDate: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  startGameDate: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  finishGameDate: Date;

  @OneToMany(() => QuizProgress, (progress) => progress.gameId)
  progresses: QuizProgress[];

  @ManyToMany(() => Question)
  @JoinTable()
  questions: Question[];
}
