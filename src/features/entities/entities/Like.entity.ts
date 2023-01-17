import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from './User.entity';

@Entity()
export class Likes {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  status: string;

  @Column()
  createdAt: Date;

  @Column()
  likeableType: string;

  @Column()
  likeableId: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => Users, (user) => user.id, { onDelete: 'CASCADE' })
  user: Users;
}
