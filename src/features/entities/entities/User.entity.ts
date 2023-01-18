import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Sessions } from './Session.entity';
import { AppBan } from './AppBan.entity';
import { EmailConfirmation } from './EmailConfirmation.entity';
import { RecoveryData } from './RecoveryData.entity';
import { Likes } from './Like.entity';
import { BlogUserBan } from './BlogUserBan.entity';
import { Comments } from './Comment.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  login: string;

  @Column()
  email: string;

  @Column()
  createdAt: Date;

  @Column()
  passwordHash: string;

  @Column()
  passwordSalt: string;

  @OneToMany(() => Sessions, (session) => session.userId)
  sessions: Sessions[];

  @OneToMany(() => AppBan, (appBan) => appBan.userId)
  appBan: AppBan[];

  @OneToMany(() => EmailConfirmation, (emailConfirm) => emailConfirm.userId)
  emailConfirm: EmailConfirmation[];

  @OneToMany(() => RecoveryData, (recoveryData) => recoveryData.userId)
  recoveryData: RecoveryData[];

  @OneToMany(() => Likes, (like) => like.userId)
  likes: Likes[];

  @OneToMany(() => BlogUserBan, (bannedBlog) => bannedBlog.userId)
  bannedBlog: BlogUserBan[];

  @OneToMany(() => Comments, (comment) => comment.userId)
  comment: Comments[];
}
