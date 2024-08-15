import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @Length(5, 64)
  fullname: string;

  @IsOptional()
  @IsString()
  @Length(5, 20)
  username: string;

  @IsOptional()
  @IsString()
  @Length(8, 64)
  currentPassword: string;

  @IsOptional()
  @IsString()
  @Length(8, 64)
  newPassword: string;
}
