import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SigninDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 64)
  readonly password: string;
}
