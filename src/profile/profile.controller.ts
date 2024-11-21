import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, UseInterceptors, UploadedFile, HttpException } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RoleDto } from './dto/update-role.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { Express } from 'express';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(AuthGuard)
  @Get('allProfiles')
  @ApiBearerAuth('bearerAuth')
  async findAllProfiles(@Request() req) {
    console.log(req.profile.sub);
    const idEnterprise = await this.profileService.findEnterpriseByProfileId(
      req.profile.sub,
    );
    return await this.profileService.findAllProfiles(idEnterprise);
  }

  @UseGuards(AuthGuard)
  @Post('signUp')
  @ApiBody({
    type: CreateProfileDto,
    examples: {
      example: {
        value: {
          email: 'test@gmail.com',
          name: 'Nicolas Velasco',
          phone: '1234567890',
          password: 'password',
          role: 'ADMIN',
        },
      },
    },
  })
  @ApiBearerAuth('bearerAuth')
  async createProfile(
    @Request() req,
    @Body() createProfileDto: CreateProfileDto,
  ) {
    const idEnterprise = await this.profileService.findEnterpriseByProfileId(
      req.profile.sub,
    );
    return await this.profileService.createProfile(
      createProfileDto,
      idEnterprise,
    );
  }

  @UseGuards(AuthGuard)
  @Get('getById/:id')
  @ApiBearerAuth('bearerAuth')
  async findProfileById(@Param('id') id: string) {
    return await this.profileService.findProfileById(id);
  }

  @UseGuards(AuthGuard)
  @Delete('deleteProfile/:id')
  @ApiBearerAuth('bearerAuth')
  async softDelete(@Param('id') id: string) {
    return await this.profileService.softDeleteById(id);
  }

  @UseGuards(AuthGuard)
  @Patch('updateRole/:id')
  @ApiBody({
    type: CreateProfileDto,
    examples: {
      example: {
        value: {
          role: 'ADMIN',
        },
      },
    },
  })
  @ApiBearerAuth('bearerAuth')
  async updateRole(@Param('id') id: string, @Body() roleDto: RoleDto) {
    return await this.profileService.updateRole(id, roleDto);
  }

  @UseGuards(AuthGuard)
  @Patch('updateProfile/:id')
  @ApiBody({
    type: CreateProfileDto,
    examples: {
      example: {
        value: {
          email: 'test@gmail.com',
          name: 'Nicolas Velasco',
          phone: '1234567890',
          password: 'password',
          role: 'ADMIN',
        },
      },
    },
  })
  @ApiBearerAuth('bearerAuth')
  async updateProfile(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return await this.profileService.updateProfile({
      id: id,
      ...updateProfileDto,
    });
  }

  @UseGuards(AuthGuard)
  @Get('getQRUrl')
  @ApiBearerAuth('bearerAuth')
  async getQRUrl() {
    return await this.profileService.getQrUrl();
  }

  @Post('QRUrl')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {

      if(!file) {
        throw new HttpException('File not found', 400);
      }

      //const filePath = './uploads/' + file.originalname;
      //await fs.promises.writeFile(filePath, file.buffer);

      return {
        mensaje: 'Archivo subido exitosamente',
        archivo: {
          nombre: file.originalname,
          mimetype: file.mimetype,
          tamaño: file.size,
          ruta: 'filePath',
        },
      };
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }
}
