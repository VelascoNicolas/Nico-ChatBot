import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signUp.dto';
import { AuthGuard } from './guards/auth.guard';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signIn')
  @ApiBody({
    type: SignInDto,
  examples: {
    example: {
      value: {
        email: 'test@test.com',
        password: 'password',
      }
    }
  }})
  @ApiTags('Profile')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto.email, signInDto.pass);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.profile;
  }
}
