import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Posts } from './Post.entity';
import { BlogUserBan } from './BlogUserBan.entity';

@Entity()
export class Blogs {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  websiteUrl: string;

  @Column()
  isBanned: boolean;

  @Column()
  banDate: Date;

  @Column()
  createdAt: Date;

  @Column({ type: 'uuid' })
  ownerId: string;

  @OneToMany(() => Posts, (post) => post.blogId)
  post: Posts[];

  @OneToMany(() => BlogUserBan, (buser) => buser.blogId)
  bannedUsers: BlogUserBan[];
}
