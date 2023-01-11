import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from './User.entity';

@Entity()
export class EmailConfirmation {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  confirmationCode: string;

  @Column()
  expirationDate: Date;

  @Column()
  isConfirmed: boolean;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => Users, (user) => user.id)
  user: Users;
}
