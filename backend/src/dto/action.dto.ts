import { IsNotEmpty, IsString } from 'class-validator';

export class ActionDto {
  @IsNotEmpty()
  @IsString()
  action: string;
}
