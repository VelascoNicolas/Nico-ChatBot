import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RoleDto } from './dto/update-role.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(AuthGuard)
  @Get('allProfiles')
  @ApiBearerAuth('bearerAuth')
  async findAllProfiles(@Request() req) {
    console.log(req.profile.sub);
    const idEnterprise = await this.profileService.findEnterpriseByProfileId(req.profile.sub);
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
        role: 'ADMIN'
      }
    }
  }})
  @ApiBearerAuth('bearerAuth')
  async createProfile(@Request() req, @Body() createProfileDto: CreateProfileDto) {
    const idEnterprise = await this.profileService.findEnterpriseByProfileId(req.profile.sub);
    return await this.profileService.createProfile(createProfileDto, idEnterprise);
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
        role: 'ADMIN'
      }
    }
  }})
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
        role: 'ADMIN'
      }
    }
  }})
  @ApiBearerAuth('bearerAuth')
  async updateProfile(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return await this.profileService.updateProfile({id: id, ...updateProfileDto});
  }

  @UseGuards(AuthGuard)
  @Get('getQRUrl')
  @ApiBearerAuth('bearerAuth')
  async getQRUrl() {
    return await this.profileService.getQrUrl();
  }
}
