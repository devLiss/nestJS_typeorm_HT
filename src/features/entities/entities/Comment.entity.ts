import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Posts } from './Post.entity';
import { Users } from './User.entity';

@Entity()
export class Comments {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  content: string;

  @Column()
  createdAt: Date;

  @Column({ type: 'uuid' })
  postId: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => Posts, (post) => post.id, { onDelete: 'CASCADE' })
  post: Posts;

  @ManyToOne(() => Users, (user) => user.id, { onDelete: 'CASCADE' })
  user: Users;
}
