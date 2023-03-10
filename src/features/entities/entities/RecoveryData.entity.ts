import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from './User.entity';

@Entity('recoveryData')
export class RecoveryData {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  recoveryCode: string;

  @Column()
  expirationDate: Date;

  @Column()
  isConfirmed: boolean;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => Users, (user) => user.id, { onDelete: 'CASCADE' })
  user: Users;
}
