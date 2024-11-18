import { ForbiddenException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client, PrismaClient } from '@prisma/client';
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class ClientService extends PrismaClient implements OnModuleInit {
  constructor(private readonly profileService: ProfileService) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  private async getEnterpriseIdFromToken(profileId: string): Promise<string> {
    try {
      return this.profileService.findEnterpriseByProfileId(profileId);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAllEntitiesForAEnterprise(profileId: string): Promise<Client[]> {
    try {
      const enterpriseId = await this.getEnterpriseIdFromToken(profileId);
      return this.client.findMany({
        where: { enterpriseId, available: true, deletedAt: { gte: new Date() } },
        include: { enterprise: true },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAllDeletedEntitiesForAEnterprise(profileId: string): Promise<Client[]> {
    try {
      const enterpriseId = await this.getEnterpriseIdFromToken(profileId);
      return this.client.findMany({
        where: { enterpriseId },
        include: { enterprise: true },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async getByIdEntityForAEnterprise(profileId: string, idClient: string): Promise<Client> {
    try {
      const enterpriseId = await this.getEnterpriseIdFromToken(profileId);
      const client = await this.client.findFirst({
        where: { id: idClient, enterpriseId, available: true, deletedAt: { gte: new Date() } },
      });
  
      if (!client) {
        throw new NotFoundException('Client not found');
      }
  
      return client;
    } catch (error) {
      throw new Error(error);
    }
  }

  async createEntityForAEnterprise(profileId: string, data: CreateClientDto): Promise<Client> {
    try {
      const enterpriseId = await this.getEnterpriseIdFromToken(profileId);
      return this.client.create({
        data: {
          ...data,
          enterpriseId,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateEntityForAEnterprise(
    profileId: string,
    idClient: string,
    data: Partial<UpdateClientDto>,
  ): Promise<Client> {
    try {
      const enterpriseId = await this.getEnterpriseIdFromToken(profileId);
      const client = await this.client.findFirst({ where: { id: idClient, enterpriseId } });
  
      if (!client) {
        throw new NotFoundException('Client not found');
      }
  
      return this.client.update({
        where: { id: idClient },
        data: {
          ...data,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteEntityForAEnterprise(profileId: string, idClient: string): Promise<{ message: string }> {
    try {
      const enterpriseId = await this.getEnterpriseIdFromToken(profileId);
      const client = await this.client.findFirst({ where: { id: idClient, enterpriseId } });
  
      if (!client) {
        throw new NotFoundException('Client not found');
      }
  
      if (client.enterpriseId !== enterpriseId) {
        throw new ForbiddenException('Permission denied');
      }
  
      await this.client.delete({ where: { id: idClient } });
  
      return { message: `Client with ID ${idClient} has been permanently deleted.` };
    } catch (error) {
      throw new Error(error);
    }
  }

  async logicDeleteForAEnterprise(profileId: string, idClient: string): Promise<{ message: string }> {
    try {
      const enterpriseId = await this.getEnterpriseIdFromToken(profileId);
      const client = await this.client.findFirst({ where: { id: idClient, enterpriseId } });
  
      if (!client) {
        throw new NotFoundException('Client not found');
      }
  
      if (client.enterpriseId !== enterpriseId) {
        throw new ForbiddenException('Permission denied');
      }
  
      await this.client.update({
        where: { id: idClient },
        data: {
          available: false,
          deletedAt: new Date(),
        },
      });
  
      return { message: `Client with ID ${idClient} has been soft deleted.` };
    } catch (error) {
      throw new Error(error);
    }
  }

  async restoreLogicDeletedForAEnterprise(profileId: string, idClient: string): Promise<Client> {
    try {
      const enterpriseId = await this.getEnterpriseIdFromToken(profileId);
      const client = await this.client.findFirst({ where: { id: idClient, enterpriseId } });
  
      if (!client || client.available) {
        throw new NotFoundException('Client not found or already active');
      }
  
      return this.client.update({
        where: { id: idClient },
        data: {
          available: true,
          deletedAt: new Date('9999-12-12T00:00:00.000Z'),
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
