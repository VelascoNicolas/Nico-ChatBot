import { HttpException, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaClient } from '@prisma/client';
import { RoleDto } from './dto/update-role.dto';
import axios from 'axios';
import * as cheerio from 'cheerio';


@Injectable()
export class ProfileService extends PrismaClient implements OnModuleInit {
  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async findAllProfiles(idEnterprise: string) {
    const profiles = await this.profiles.findMany({
      where: { enterpriseId: idEnterprise, available: true},
      include: { enterprise: true },
    });
    
    return profiles;
  }

  async findProfileById(id: string) {
    const profile = await this.profiles.findUnique({
      where: { id: id, available: true },
      include: { enterprise: true },
    });

    if (!profile) {
      throw new HttpException('Profile not found', 404);
    }

    return profile;
  }

  async createProfile(createProfileDto: CreateProfileDto, enterpriseID: string) {
    const enterprise = await this.enterprises.findUnique({
      where: { id: enterpriseID, available: true },
    });

    if (!enterprise) {
      throw new HttpException('Enterprise not found', 404);
    }
    createProfileDto.enterpriseId = enterprise.id;

    const deleted: Date = new Date("9999-12-12");
    const { enterpriseId, ...profilesData } = createProfileDto;
    const profile = await this.profiles.create({
      data: { ...profilesData, deletedAt: deleted, enterpriseId: enterprise.id },
    });
    const { password, ...data} = profile;
    return data;
  }

  async findProfileByMail(mail: string): Promise<any> {
    const profile = await this.profiles.findFirst({
      where: { email: mail, available: true},
    });

    if (!profile) {
      throw new HttpException('Profile not found', 404);
    }

    return profile;
  }

  async findEnterpriseByProfileId(profileId: string) {
    const profile = await this.profiles.findUnique({
      where: { id: profileId, available: true },
      include: { enterprise: true },
    });

    if (!profile) {
      throw new HttpException('Profile not found', 404);
    }

    const enterID: string = profile.enterpriseId;
    return enterID;
  }

  async updateProfile(updateProfileDto: UpdateProfileDto) {
    try {
      const { id: __, ...data } = updateProfileDto;

      const profile = await this.profiles.findUnique({
        where: { id: __ , available: true},
      });

      if (!profile) {
        throw new HttpException('Profile not found', 404);
      }

      const update = await this.profiles.update({
        where: {id: profile.id, available: true},
        data: data,
      });

      const {password, ...info} = update;

      return info;
    } catch (error) {
      throw new HttpException('Failed to update profile', 500);
    }
  }

  async softDeleteById(id: string) {

    const profile = await this.profiles.findUnique({
      where: { id: id, available: true},
    });

    if (!profile) {
      throw new HttpException('Profile not found', 404);
    }

    const dateDelete = new Date(Date.now());

    const deleted = await this.profiles.update({
      where: { id: id },
      data: { deletedAt: dateDelete, available: false },
    })

    return 'Profile deleted successfully';
  }

  async updateRole(id: string, role: RoleDto) {
    const profile = await this.profiles.findUnique({
      where: { id: id, available: true },
    });

    if (!profile) {
      throw new HttpException('Profile not found', 404);
    }

    if(profile.role === role.role) return profile; 

    const update = await this.profiles.update({
      where: { id: id },
      data: { role: role.role },
    });

    return update;
  }

  async getQrUrl(): Promise<string> {
    const url = 'https://apichatbotdev.medprouno.com/';

    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        // ... your selector logic here
        const qrImageUrl = $('img[alt="QR"]').attr('src');

        return qrImageUrl;
    } catch (error) {
        console.error('Error fetching QR URL:', error);
        throw error; // Or handle the error as needed
    }
  }
}
