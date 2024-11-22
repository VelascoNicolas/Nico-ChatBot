import { Body, Controller, Get, Post, Req, Request, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signUp.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

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

  @Get('validateQR')
  @ApiTags('Authenticated')
  async getToken() {
    return 'hola';
  }
  

  @ApiTags('Authenticated')
  @Post('authenticated')
  @ApiBearerAuth('bearerAuth')
  async getProfile(@Req() req, @Res() res) {
    try {
      const [type, token] = req.headers.authorization?.split(' ') ?? [];
      const tok = type === 'Bearer' ? token : undefined;

      await this.jwtService.verifyAsync(token);
      return res.status(200).json({ token: token });

    } catch (error) {
      return res.status(200).json({ isValid: false, message: error.message });
    }
  }

  @Post('nicowii')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads'
      , filename: (req, file, cb) => {
        // Generating a 32 random chars long string
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
        //Calling the callback passing the random name generated with the original extension name
        cb(null, `${randomName}${extname(file.originalname)}`)
      }
    })
  }))
  async upload( @UploadedFile() file) {
    console.log(file)
  }
}
