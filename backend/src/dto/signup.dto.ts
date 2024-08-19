import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  @Length(5, 64)
  readonly fullname: string;

  @IsNotEmpty()
  @IsString()
  @Length(4, 20)
  readonly username: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 64)
  readonly password: string;
}
