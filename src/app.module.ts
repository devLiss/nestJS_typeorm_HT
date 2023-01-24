import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';

import * as mongoose from 'mongoose';
import { EmailModule } from './emailManager/emailModule';

import { JwtService } from './features/api/public/sessions/application/jwt.service';
import { ThrottlerModule } from '@nestjs/throttler';
import { BlogsController } from './features/api/bloggers/blogs/api/blogs.controller';

import { CqrsModule } from '@nestjs/cqrs';
import { CreateBlogUseCase } from './features/api/bloggers/blogs/application/useCases/createBlog.useCase';

import { UsersService } from './features/api/super-admin/users/application/users.service';
import { CommentsService } from './features/api/public/comments/application/comments.service';

import { RegisterUseCase } from './features/api/public/auth/application/useCases/register.useCase';

import { AuthController } from './features/api/public/auth/api/auth.controller';
import { LoginUseCase } from './features/api/public/auth/application/useCases/login.useCase';
import { BlogIdValidation } from './common/validators/BlogIdValidation';
import { PostsService } from './features/api/public/posts/application/posts.service';
import { PasswordRecoveryUseCase } from './features/api/public/auth/application/useCases/passwordRecovery.useCase';
import { NewPasswordUseCase } from './features/api/public/auth/application/useCases/newPassword.useCase';
import { RefreshTokenUseCase } from './features/api/public/auth/application/useCases/refreshToken.useCase';
import { ConfirmRegistrationUseCase } from './features/api/public/auth/application/useCases/confirmRegistration.useCase';
import { ResendEmailUseCase } from './features/api/public/auth/application/useCases/resendEmail.useCase';
import { GetInfoByMeUseCase } from './features/api/public/auth/application/useCases/getInfoByMe.useCase';
import { LogoutUseCase } from './features/api/public/auth/application/useCases/logout.useCase';
import { GetBlogsUseCase } from './features/api/bloggers/blogs/application/useCases/getBlogs.useCase';
import { DeleteBlogUseCase } from './features/api/bloggers/blogs/application/useCases/deleteBlog.useCase';
import { UpdateBlogUseCase } from './features/api/bloggers/blogs/application/useCases/updateBlog.useCase';
import { CreatePostUseCase } from './features/api/bloggers/blogs/application/useCases/createPost.useCase';
import { UpdatePostUseCase } from './features/api/bloggers/blogs/application/useCases/updatePost.useCase';
import { DeletePostUseCase } from './features/api/bloggers/blogs/application/useCases/deletePost.useCase';
import { GetAllBlogsUseCase } from './features/api/super-admin/blogs/application/useCases/getAllBlogs.useCase';
import { SABlogsController } from './features/api/super-admin/blogs/blogs.controller';
import { UsersController } from './features/api/super-admin/users/api/users.controller';
import { BanUserUseCase } from './features/api/super-admin/users/application/useCases/banUser.useCase';
import { SessionsService } from './features/api/public/sessions/application/sessions.service';
import { DeleteUserUseCase } from './features/api/super-admin/users/application/useCases/deleteUser.useCase';
import { PublicBlogsController } from './features/api/public/blogs/blogs.controller';
import { TerminateByIdUseCase } from './features/api/public/sessions/application/useCases/terminateById.useCase';
import { SessionsController } from './features/api/public/sessions/api/sessions.controller';
import { TerminateNotActualsUseCase } from './features/api/public/sessions/application/useCases/terminateNotActuals.useCase';
import { TestingController } from './features/api/public/testing/testing.controller';
import { PostsController } from './features/api/public/posts/api/posts.controller';
import { CommentsController } from './features/api/public/comments/api/comments.controller';
import { BanUser } from './features/api/bloggers/users/application/useCases/banUser.useCase';
import { BloggerUsersController } from './features/api/bloggers/users/api/users.controller';
import { GetBannedUsersForBlogsUseCase } from './features/api/bloggers/users/application/useCases/getBannedUsersForBlogs.useCase';
import { GetCommentsUseCase } from './features/api/bloggers/blogs/application/useCases/getComments.useCase';
import { BanBlogUseCase } from './features/api/super-admin/blogs/application/useCases/banBlog.useCase';
import { CreateUserUseCase } from './features/api/super-admin/users/application/useCases/createUser.useCase';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSqlRepository } from './features/entities/postgres/userSql.repository';
import { SessionsSqlRepository } from './features/entities/postgres/sessionsSql.repository';
import { AppController } from './app.controller';
import { BlogsSqlRepository } from './features/entities/postgres/blogsSql.repository';
import { PostSqlRepository } from './features/entities/postgres/postSql.repository';
import { CommentsSqlRepository } from './features/entities/postgres/commentsSql.repository';
import { BlogBannedUsersSqlRepository } from './features/entities/postgres/blogBannedUsersSql.repository';
import { UpdateCommentHandler } from './features/api/public/comments/application/handlers/updateComment.handler';
import { DeleteCommentHandler } from './features/api/public/comments/application/handlers/deleteComment.handler';
import { LikesSqlRepository } from './features/entities/postgres/likesSql.repository';
import { MakeLikeHandler } from './features/api/public/comments/application/handlers/makeLike.handler';
import { Blogs } from './features/entities/entities/Blogs.entity';
import { AppBan } from './features/entities/entities/AppBan.entity';
import { BlogUserBan } from './features/entities/entities/BlogUserBan.entity';
import { Comments } from './features/entities/entities/Comment.entity';
import { EmailConfirmation } from './features/entities/entities/EmailConfirmation.entity';
import { Likes } from './features/entities/entities/Like.entity';
import { RecoveryData } from './features/entities/entities/RecoveryData.entity';
import { Posts } from './features/entities/entities/Post.entity';
import { Sessions } from './features/entities/entities/Session.entity';
import { Users } from './features/entities/entities/User.entity';
import { Question } from './features/entities/entities/Question.entity';
import { Answer } from './features/entities/entities/Answers.entity';
import { CreateQuestionHandler } from './features/api/super-admin/quiz/handlers/createQuestion.handler';
import { QuizRepository } from './features/api/super-admin/quiz/quiz.repository';
import { QuizController } from './features/api/super-admin/quiz/quiz.controller';
import { GetAllQuestionsHandler } from './features/api/super-admin/quiz/handlers/getAllQuestions.handler';
import { DeleteQuestionHandler } from './features/api/super-admin/quiz/handlers/deleteQuestion.handler';
import { PublishQuestionHandler } from './features/api/super-admin/quiz/handlers/publishQuestion.handler';
import { UpdateQuestionHandler } from './features/api/super-admin/quiz/handlers/updateQuestion.handler';
import { QuizPair } from './features/entities/entities/QuizPair.entity';
import { QuizProgress } from './features/entities/entities/QuizProgress.entity';
import { PairQuizGameController } from './features/api/public/pair-quiz-game/pair-quiz-game.controller';
import { PairQuizGameRepository } from './features/api/public/pair-quiz-game/pair-quiz-game.repository';
import { ConnectToGameHandler } from './features/api/public/pair-quiz-game/handlers/connectToGame.handler';
import { SendAnswerHandler } from './features/api/public/pair-quiz-game/handlers/sendAnswer.handler';
import { GetQuizByIdHandler } from './features/api/public/pair-quiz-game/handlers/getQuizById.handler';
import {
  GetCurrentGameHandler,
  GetCurrentGameQuery,
} from './features/api/public/pair-quiz-game/handlers/getCurrentGame.handler';

mongoose.set('toJSON', {
  virtuals: true,
  transform: (doc, converted) => {
    delete converted._id;
  },
});
const handlers = [
  CreateBlogUseCase,
  RegisterUseCase,
  LoginUseCase,
  PasswordRecoveryUseCase,
  NewPasswordUseCase,
  RefreshTokenUseCase,
  ConfirmRegistrationUseCase,
  ResendEmailUseCase,
  GetInfoByMeUseCase,
  LogoutUseCase,
  GetBlogsUseCase,
  DeleteBlogUseCase,
  UpdateBlogUseCase,
  CreatePostUseCase,
  UpdatePostUseCase,
  DeletePostUseCase,
  GetAllBlogsUseCase,
  BanUserUseCase,
  DeleteUserUseCase,
  TerminateByIdUseCase,
  TerminateNotActualsUseCase,
  BanUser,
  GetBannedUsersForBlogsUseCase,
  GetCommentsUseCase,
  BanBlogUseCase,
  CreateUserUseCase,
  UpdateCommentHandler,
  DeleteCommentHandler,
  MakeLikeHandler,
  CreateQuestionHandler,
  GetAllQuestionsHandler,
  DeleteQuestionHandler,
  PublishQuestionHandler,
  UpdateQuestionHandler,
  ConnectToGameHandler,
  SendAnswerHandler,
  GetQuizByIdHandler,
  GetCurrentGameHandler,
];
const repos = [];
const sqlRepos = [
  UserSqlRepository,
  SessionsSqlRepository,
  BlogsSqlRepository,
  PostSqlRepository,
  CommentsSqlRepository,
  BlogBannedUsersSqlRepository,
  LikesSqlRepository,
  QuizRepository,
  PairQuizGameRepository,
];
const services = [
  JwtService,
  UsersService,
  CommentsService,
  PostsService,
  SessionsService,
];
const validators = [BlogIdValidation];
const controllers = [
  BlogsController,
  AuthController,
  SABlogsController,
  UsersController,
  PublicBlogsController,
  SessionsController,
  TestingController,
  PostsController,
  CommentsController,
  BloggerUsersController,
  QuizController,
  PairQuizGameController,
];
@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    /*ThrottlerModule.forRoot({
      ttl: 10,
      limit: 5,
    }),*/
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      entities: [
        Blogs,
        AppBan,
        BlogUserBan,
        Comments,
        EmailConfirmation,
        Likes,
        Posts,
        RecoveryData,
        Sessions,
        Users,
        Question,
        Answer,
        QuizPair,
        QuizProgress,
      ],
      synchronize: true,
    }),
    EmailModule,
  ],
  controllers: [AppController, ...controllers],
  providers: [
    AppService,
    ...repos,
    ...services,
    ...handlers,
    ...validators,
    ...sqlRepos,
  ],
})
export class AppModule {}
