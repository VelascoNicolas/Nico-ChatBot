import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ClientService extends PrismaClient implements OnModuleInit{

  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async getAllClientsForEnterprise(idEnterprise: string) {
    const enterprise = await this.enterprises.findUnique({
      where: {
        id: idEnterprise,
        available: true,
      }
    })

    if (!enterprise) {
      throw new Error('Enterprise not found');
    }

    const clients = await this.clients.findMany({
      where: {
        enterpriseId: enterprise.id,
        available: true,
      }
    })

    if(clients.length === 0) {
      throw new Error(`Clients not found for Enterprise with id: ${enterprise.id}`);
    }

    return clients;
  }

  async getClientById(id: string, idEnterprise: string) {

    const enterprise = await this.enterprises.findUnique({
      where: {
        id: idEnterprise,
        available: true,
      }
    });

    if (!enterprise) {
      throw new Error('Enterprise not found');
    }

    const client = await this.clients.findUnique({
      where: {
        id,
        enterpriseId: enterprise.id,
        available: true,
      }
    });

    if (!client) {
      throw new Error(`Client not found for Enterprise with id: ${enterprise.id}`);
    }

    return client;
  }

  async createClient(createClientDto: CreateClientDto) {
    const enterprise = await this.enterprises.findUnique({
      where: {
        id: createClientDto.enterpriseId,
        available: true,
      }
    });

    if (!enterprise) {
      throw new Error('Enterprise not found');
    }

    const client = await this.clients.create({
      data: {
        username: createClientDto.username,
        phone: createClientDto.phone,
        enterpriseId: enterprise.id,
        available: true,
      },
      include: {
        enterprise: true,
      }
    });

    return client;
  }

  async getAllDeletedClients(idEnterprise: string) {
    const enterprise = await this.enterprises.findUnique({
      where: {
        id: idEnterprise,
        available: true,
      }
    });

    if (!enterprise) {
      throw new Error('Enterprise not found');
    }

    const clients = await this.clients.findMany({
      where: {
        enterpriseId: enterprise.id,
        available: false,
      }
    });

    if(clients.length === 0) {
      throw new Error(`Deleted Clients not found for Enterprise with id: ${enterprise.id}`);
    }

    return clients;
  }

  async updateClient(id: string, updateClientDto: UpdateClientDto) {
    
    const enterprise = await this.enterprises.findUnique({
      where: {
        id: updateClientDto.enterpriseId,
        available: true,
      }
    });

    if (!enterprise) {
      throw new Error('Enterprise not found');
    }
    
    const client = await this.clients.findUnique({
      where: {
        id,
        enterpriseId: enterprise.id,
        available: true,
      }
    });

    if (!client) {
      throw new Error('Client not found');
    }

    const updatedClient = await this.clients.update({
      where: {
        id,
      },
      data: {
        username: updateClientDto.username,
        phone: updateClientDto.phone,
        enterpriseId: enterprise.id,
      },
      include: {
        enterprise: true,
      }
    });

    return updatedClient;
  }

  async softDelete(id: string) {
    const client = await this.clients.findUnique({
      where: {
        id,
        available: true,
      }
    });

    if (!client) {
      throw new Error('Client not found');
    }

    const deletedClient = await this.clients.update({
      where: {
        id,
      },
      data: {
        available: false,
      },
      include: {
        enterprise: true,
      }
    });

    return {message: `Client with ID ${deletedClient.id} has been deleted successfully`};
  }

  async restoreClient(id: string) {
    const client = await this.clients.findUnique({
      where: {
        id,
        available: false,
      }
    });

    if (!client) {
      throw new Error('Client not found');
    }

    const restoredClient = await this.clients.update({
      where: {
        id,
      },
      data: {
        available: true,
      },
      include: {
        enterprise: true,
      }
    });

    return {message: `Client with ID ${restoredClient.id} has been restored successfully`};
  }
}
