import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Posts } from './Post.entity';
import { BlogUserBan } from './BlogUserBan.entity';
import { Users } from './User.entity';

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

  /*@Column({ type: 'uuid' })
  ownerId: string;
*/
  @OneToOne(() => Users)
  @JoinColumn({ name: 'ownerId' })
  user: Users;

  @OneToMany(() => Posts, (post) => post.blogId)
  post: Posts[];

  @OneToMany(() => BlogUserBan, (buser) => buser.blogId)
  bannedUsers: BlogUserBan[];
}
