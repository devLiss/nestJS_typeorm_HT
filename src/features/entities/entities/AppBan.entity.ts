import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from './User.entity';

@Entity()
export class AppBan {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  isBanned: boolean;

  @Column()
  banDate: Date;

  @Column()
  banReason: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => Users, (user) => user.id)
  user: Users;
}
