import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import {
  forgetpassworddto,
  ForgotPasswordDto,
} from 'src/auth/dto/forgotpassword.dto';
import { SignUpDto } from 'src/auth/dto/signup.dto';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendUserWelcome(signUpDto: SignUpDto) {
    await this.mailerService.sendMail({
      to: signUpDto.email,
      subject: 'Welcome to Nice App! Confirm your Email',
      //   template: './welcome',
      context: {
        name: signUpDto.name,
      },
    });
  }
  async sendpasswordreset(forgotPasswordDto: ForgotPasswordDto) {
    const url = `${forgotPasswordDto.resettoken}`;
    await this.mailerService.sendMail({
      to: forgotPasswordDto.email,
      subject: 'welcomereset your password',
      html: `this token  ${url} to reset your password!`,
      context: {
        email: forgotPasswordDto.email,
      },
    });
  }
  async sendpasswordresetwithotp(ForgetpassworDto: forgetpassworddto) {
    const otp = `${ForgetpassworDto.otp}`;
    await this.mailerService.sendMail({
      to: ForgetpassworDto.email,
      subject: 'welcomereset your password',
      html: `Your One Time Password is ${otp}`,
      context: {
        email: ForgetpassworDto.email,
      },
    });
  }
}
