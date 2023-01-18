import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BlogsSqlRepository } from '../../features/entities/postgres/blogsSql.repository';
@Injectable()
export class CheckBlogInBodyGuard implements CanActivate {
  constructor(private blogQueryRepo: BlogsSqlRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    const blog = await this.blogQueryRepo.getById(req.body.blogId);

    console.log(user);
    console.log(blog);
    if (!blog) throw new NotFoundException();
    if (blog.ownerId != user.id) throw new ForbiddenException();
    req.blog = blog;
    return true;
  }
}
