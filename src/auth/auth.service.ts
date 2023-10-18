import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { EmailService } from '../email/email.service';
import { forgetpassworddto, ForgotPasswordDto } from './dto/forgotpassword.dto';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { ResetPasswordDto, resetpassworddto } from './dto/resetpassword.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectModel(User.name) private usermodel: Model<User>,
    private jwtService: JwtService,
    private emailservice: EmailService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<any> {
    const { name, email, password } = signUpDto;
    const existingUser = await this.usermodel.findOne({ email: email });
    if (existingUser) {
      throw new BadRequestException('user already exist ');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usermodel.create({
      name,
      email,
      password: hashedPassword,
    });
    await this.emailservice.sendUserWelcome(signUpDto);
    console.log('email sent scuessfully');
    // const token = this.jwtService.sign({
    //   id: user._id,
    //   name: user.name,
    //   email: user.email,
    // });

    return {
      user,
      statusCode: 200,
      message: 'success.',
    };
  }
  async findAll(): Promise<any[]> {
    return this.usermodel.find().exec();
  }

  async findByfind(id: string): Promise<any> {
    return this.usermodel.findById(id);
  }

  async remove(id: string): Promise<any> {
    return this.usermodel.findByIdAndDelete(id).exec();
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;

    const user = await this.usermodel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid password');
    }

    const token = this.jwtService.sign({
      id: user._id,
      email: user.email,
      name: user.name,
    });

    return { token };
  }

  async forgotpassword(forgotPasswordDto: ForgotPasswordDto): Promise<any> {
    const { email } = forgotPasswordDto;
    const notuser = await this.usermodel.findOne({ email });
    if (!notuser) {
      throw new UnauthorizedException('Invalid email');
    }

    await this.emailservice.sendpasswordreset(forgotPasswordDto);
    console.log('email sent scuessfully');
  }

  async ResetPassword(resetPasswordDto: ResetPasswordDto): Promise<any> {
    const { email } = resetPasswordDto;
    const key = `${email}_resettoken`;
    const chacedtoken = await this.cacheManager.get(key);
    if (chacedtoken) {
      const { newpassword, password_confirm } = resetPasswordDto;
      if (newpassword != password_confirm) {
        throw new BadRequestException('password do not match');
      }
      const hashedPassword = await bcrypt.hash(newpassword, 10);
      const user = await this.usermodel.updateOne({
        password: hashedPassword,
      });
      return user;
    } else {
      throw new InternalServerErrorException('invalid or expired reset token.');
    }
  }

  // // async findbyemail(email): Promise<any> {
  //   const key = `${email}_resettoken`;
  //   const chacedtoken = await this.cacheManager.get(key);
  //   if (chacedtoken) {
  //     const resetPasswordDto: ResetPasswordDto;
  //     const hashedPassword = await bcrypt.hash(
  //       resetPasswordDto.newpassword,
  //       10,
  //     );
  //       const user = await this.usermodel.updateOne({
  //         password: hashedPassword,
  //     });
  //     return user;
  //     } else {
  //       throw new Error('invalid or expired reset token.');
  //     }
  //   }
  //   async updatebytoken(resetPasswordDto: ResetPasswordDto): Promise<any> {
  //     const hashedPassword = await bcrypt.hash(resetPasswordDto.newpassword, 10);
  //     const user = await this.usermodel.updateOne({
  //       password: hashedPassword,
  //     });
  //     return user;
  //   }
  // }
  // async getAllData(): Promise<any[]> {
  //   const allData = [];
  //   // Assuming a specific naming pattern for cached keys, e.g., 'data_1', 'data_2', ...
  //   for (let i = 1; ; i++) {
  //     const key = `data_${i}`;
  //     const value = await this.cacheManager.get(key);
  //     if (!value) {
  //       break; // Stop when a key doesn't exist
  //     }
  //     allData.push({ key, value });
  //   }
  //   return allData;
  // }
  async forgotpasswordwithotp(
    forgotPasswordDto: forgetpassworddto,
  ): Promise<any> {
    const { email } = forgotPasswordDto;
    const notuser = await this.usermodel.findOne({ email });
    if (!notuser) {
      throw new UnauthorizedException('Invalid email');
    }
    await this.emailservice.sendpasswordresetwithotp(forgotPasswordDto);
    console.log('email sent scuessfully');
  }

  async ResetPasswordwithotp(ResetPasswordDto: resetpassworddto): Promise<any> {
    const { email } = ResetPasswordDto;
    const key = `${email}_otp`;
    const chacedotp = await this.cacheManager.get(key);
    if (chacedotp) {
      const { newpassword, password_confirm } = ResetPasswordDto;
      if (newpassword != password_confirm) {
        throw new BadRequestException('password do not match');
      }
      const hashedPassword = await bcrypt.hash(newpassword, 10);
      const user = await this.usermodel.updateOne({
        password: hashedPassword,
      });
      return user;
    } else {
      throw new InternalServerErrorException('invalid or expired otp.');
    }
  }
}
