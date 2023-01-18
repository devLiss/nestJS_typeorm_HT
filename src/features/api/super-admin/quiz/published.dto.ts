import { IsBoolean } from 'class-validator';

export class PublishedDto {
  @IsBoolean()
  published: boolean;
}
