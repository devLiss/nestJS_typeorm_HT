import { PaginatingQueryDto } from '../../../bloggers/blogs/dto/paginatingQuery.dto';
import { IsEnum, IsOptional } from 'class-validator';

export class QuizQueryDto extends PaginatingQueryDto {
  @IsOptional()
  bodySearchTerm: string;

  @IsOptional()
  @IsEnum(['all', 'published', 'notPublished'])
  publishedStatus: string;
}
