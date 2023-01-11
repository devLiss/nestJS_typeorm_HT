import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Blogs } from './Blogs.entity';
import { Users } from './User.entity';

@Entity()
export class BlogUserBan {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  isBanned: boolean;

  @Column()
  banDate: Date;

  @Column()
  banReason: string;

  @Column()
  createdAt: Date;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  blogId: string;

  @ManyToOne(() => Blogs, (blog) => blog.id)
  blog: Blogs;

  @ManyToOne(() => Users, (user) => user.id)
  user: Users;
}
