import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @Length(4, 64)
  fullname: string;

  @IsOptional()
  @IsString()
  @Matches(/^@/, {
    message: 'Username must start with "@"',
  })
  @Length(5, 20, {
    message: 'Username must be at least 4 characters long',
  })
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
