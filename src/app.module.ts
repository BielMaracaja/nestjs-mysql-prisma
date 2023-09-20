import { Module, forwardRef} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/Auth.module';
import { UserModule } from './User/User.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler/dist/throttler.guard';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot([{
      ttl: 10,
      limit: 2
    }]),
    forwardRef(() => UserModule), 
    forwardRef(() => AuthModule),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: 'demetris.wisoky69@ethereal.email',
          pass: 'JE8hHBk71ESYkE3wBg'
      }
      },
      defaults: {
        from: '"Demetris-Ethereal-Email" <demetris.wisoky69@ethereal.email>',
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass : ThrottlerGuard
  }],
})
export class AppModule {}
