import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class ActionDto {
  @IsNotEmpty()
  @IsString()
  action: string;

  @IsOptional()
  @IsObject()
  params: object;
}
