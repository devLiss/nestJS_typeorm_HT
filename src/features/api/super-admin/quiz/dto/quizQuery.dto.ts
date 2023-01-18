import { PaginatingQueryDto } from '../../../bloggers/blogs/dto/paginatingQuery.dto';
import { IsEnum, IsOptional, Length } from 'class-validator';

export class QuizQueryDto extends PaginatingQueryDto {
  @IsOptional()
  bodySearchTerm = '';

  @IsOptional()
  @IsEnum(['all', 'published', 'notPublished'])
  publishedStatus = 'all';
}
