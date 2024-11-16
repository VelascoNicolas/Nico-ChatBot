import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { envs } from 'src/config';
import { ProfileService } from 'src/profile/profile.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: envs.secret,
      signOptions: { expiresIn: '1200s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, ProfileService],
})
export class AuthModule {}
