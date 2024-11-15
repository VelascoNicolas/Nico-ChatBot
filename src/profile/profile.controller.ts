import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileDto } from './dto/profile.dto';
import { ProfileEnterpriseDto } from './dto/profile-enterprise.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('/signIn')
  signIn(@Body() profileDto: ProfileDto) {
    return this.profileService.signIn(profileDto);
  }

  @Post('SignUpEnterprise')
  signUpWithEnterprise(@Body() profileDto: ProfileEnterpriseDto) {
    return this.profileService.signUpWithEnterprise(profileDto);
  }

  @Post('signUp/:idEnterprise')
  signUp(@Param('idEnterprise') idEnterprise: string, @Body() profileDto: ProfileDto) {
    return this.profileService.signUp(profileDto, idEnterprise);
  }

  @Get()
  findAllProfiles(@Param('idEnterprise') idEnterprise: string) {
    return this.profileService.findAllProfiles(idEnterprise);
  }
}
