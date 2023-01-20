import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from './User.entity';
import { QuizPair } from './QuizPair.entity';
@Entity()
export class QuizProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'uuid' })
  questionId: string;
  @Column({ type: 'uuid' })
  playerId: string;
  @Column({ type: 'uuid' })
  gameId: string;

  @Column({ type: 'text' })
  answerStatus: string;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP()',
  })
  addedAt: Date;

  @ManyToOne(() => Users, (user) => user.id, { onDelete: 'CASCADE' })
  player: Users;

  @ManyToOne(() => QuizPair, (pair) => pair.id, { onDelete: 'CASCADE' })
  game: QuizPair;
}
