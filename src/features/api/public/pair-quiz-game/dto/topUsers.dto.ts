import { IsArray, IsOptional } from 'class-validator';

export class TopUsersDto {
  @IsOptional()
  @IsArray()
  sort: Array<string> = ['avgScores desc ', 'sumScore desc'];
  @IsOptional()
  pageNumber = 1;
  @IsOptional()
  pageSize = 10;
}
