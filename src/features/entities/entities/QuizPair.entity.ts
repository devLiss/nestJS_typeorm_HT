import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { QuizProgress } from './QuizProgress.entity';

@Entity()
export class QuizPair {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  player1Id: string;

  @Column({ type: 'uuid' })
  player2Id: string;

  @Column({ type: 'text' })
  status: string;

  @Column({ type: 'timestamp with time zone' })
  pairCreatedDate: Date;

  @Column({ type: 'timestamp with time zone' })
  startGameDate: Date;

  @Column({ type: 'timestamp with time zone' })
  finishGameDate: Date;

  @OneToMany(() => QuizProgress, (progress) => progress.gameId)
  progresses: QuizProgress[];
}
