import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
// import { CacheModule } from '@nestjs/cache-manager';
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST'),
          secure: false,
          auth: {
            user: config.get('SMTP_USERNAME'),
            pass: config.get('SMTP_PASSWORD'),
          },
        },
        defaults: {
          from: `<${config.get('SMTP_USERNAME')}>`,
        },
      }),
      inject: [ConfigService],
    }),
    CacheModule.register({
      ttl: 36000,
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
