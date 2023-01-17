import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from './User.entity';

@Entity()
export class Sessions {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  expiredDate: Date;

  @Column()
  ip: string;

  @Column()
  lastActiveDate: Date;

  @Column()
  title: string;

  @Column({ type: 'uuid' })
  deviceId: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => Users, (user) => user.id, { onDelete: 'CASCADE' })
  user: Users;
}
