import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { FileModule } from 'src/file/File.module';
import { PrismaModule } from 'src/prisma/Prisma.module';
import { UserModule } from 'src/User/User.module';
import { AuthController } from './Auth.controller';
import { AuthService } from './Auth.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    forwardRef(() => UserModule),
    PrismaModule,
    FileModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
