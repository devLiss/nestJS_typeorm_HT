import { BlogInputModelDto } from '../../dto/blogInputModel.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsSqlRepository } from '../../../../../entities/postgres/blogsSql.repository';

export class CreateBlogCommand {
  constructor(public inputModel: BlogInputModelDto, public user: any) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand> {
  constructor(private blogSqlRepo: BlogsSqlRepository) {}
  async execute(command: CreateBlogCommand) {
    const blog = {
      name: command.inputModel.name,
      description: command.inputModel.description,
      websiteUrl: command.inputModel.websiteUrl,
      createdAt: new Date().toISOString(),
      blogOwnerInfo: { userId: command.user.id, userLogin: command.user.login },
      banInfo: {
        isBanned: false,
        banDate: null,
      },
    };

    const createdBlog = await this.blogSqlRepo.create(blog);

    return createdBlog;
  }
}
