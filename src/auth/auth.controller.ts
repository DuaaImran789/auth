import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import * as randomstring from 'randomstring';
import { ResetPasswordDto, resetpassworddto } from './dto/resetpassword.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private authService: AuthService,
  ) {}
  @Post('/signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<any> {
    return this.authService.signUp(signUpDto);
  }
  @Get()
  findAll() {
    return this.authService.findAll();
  }
  @Post('/login')
  login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    return this.authService.login(loginDto);
  }
  // send token in the mail
  @Post('/forgetwithtoken')
  async forgotpassword(@Body('email') email: string) {
    const key = `${email}_resettoken`;
    const resettoken = Math.random().toString(20).substring(2, 12);
    await this.cacheManager.set(key, resettoken);
    console.log(resettoken);
    await this.authService.forgotpassword({
      email,
      resettoken,
    });
    return {
      message: 'check your email',
    };
  }
  @Post('/resetwihtoken')
  async resetpassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<any> {
    await this.authService.ResetPassword(resetPasswordDto);
    return {
      message: 'password changed succesfully',
    };
  }

  //send otp in the mail
  @Post('/forgetwithotp')
  async forgot(@Body('email') email: string) {
    const key = `${email}_otp`;
    const otp = randomstring.generate({
      length: 6, // Change the length as needed
      charset: 'numeric',
    });
    await this.cacheManager.set(key, otp);
    console.log(otp);
    await this.authService.forgotpasswordwithotp({
      email,
      otp,
    });
    return {
      message: 'check your email',
    };
  }
  @Post('/resetwithotp')
  async reset(@Body() Resetpassworddto: resetpassworddto): Promise<any> {
    await this.authService.forgotpasswordwithotp(Resetpassworddto);
    return {
      message: 'password changed succesfully',
    };
  }
}
