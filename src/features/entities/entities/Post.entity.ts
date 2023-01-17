import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Comments } from './Comment.entity';
import { Users } from './User.entity';
import { Blogs } from './Blogs.entity';

@Entity()
export class Posts {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  shortDescription: string;

  @Column()
  createdAt: Date;

  @Column({ type: 'uuid' })
  blogId: string;

  @ManyToOne(() => Blogs, (blog) => blog.id, { onDelete: 'CASCADE' })
  blog: Blogs;

  @OneToMany(() => Comments, (comment) => comment.postId)
  comment: Comments[];
}
