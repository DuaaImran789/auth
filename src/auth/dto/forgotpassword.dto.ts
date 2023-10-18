import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  @IsString()
  readonly email: string;
  @IsNotEmpty()
  @IsString()
  readonly resettoken: string;
}
export class forgetpassworddto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  @IsString()
  readonly email: string;
  @IsNotEmpty()
  @IsString()
  readonly otp: string;
}
