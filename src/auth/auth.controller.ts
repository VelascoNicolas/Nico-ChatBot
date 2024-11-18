import { Body, Controller, Post, Req, Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signUp.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('signIn')
  @ApiBody({
    type: SignInDto,
    examples: {
      example: {
        value: {
          email: 'test@gmail.com',
          pass: 'password',
        },
      },
    },
  })
  @ApiTags('Profile')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto.email, signInDto.pass);
  }

  @ApiTags('Authenticated')
  @Post('authenticated')
  @ApiBearerAuth('bearerAuth')
  async getProfile(@Req() req, @Res() res) {
    try {
      const [type, token] = req.headers.authorization?.split(' ') ?? [];
      const tok = type === 'Bearer' ? token : undefined;

      await this.jwtService.verifyAsync(token);
      return res.status(200).json({ isValid: true });

    } catch (error) {
      return res.status(200).json({ isValid: false, message: error.message });
    }
  }
}
