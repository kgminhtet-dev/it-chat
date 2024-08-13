// eslint-disable-next-line prettier/prettier
/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class SignoutDto {
  @IsNotEmpty()
  @IsString()
  @Length(4, 20)
  username: string;
}
