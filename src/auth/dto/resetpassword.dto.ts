import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  readonly email: string;
  @IsNotEmpty()
  @IsString()
  readonly resettoken: string;

  @IsNotEmpty()
  readonly newpassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password_confirm: string;
}
export class resetpassworddto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  readonly email: string;
  @IsNotEmpty()
  @IsString()
  readonly otp: string;

  @IsNotEmpty()
  readonly newpassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password_confirm: string;
}
