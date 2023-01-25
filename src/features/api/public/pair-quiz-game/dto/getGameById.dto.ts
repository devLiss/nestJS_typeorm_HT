import { IsUUID } from 'class-validator';

export class GetGameByIdDto {
  @IsUUID()
  id: string;
}
