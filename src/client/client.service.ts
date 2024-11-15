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

  async findAllClientsWithAEnterprise(createClientDto: CreateClientDto) {
    return await this.client.findMany({
      where: { enterprise: { id: createClientDto.enterpriseId } }
    });
  }

  async findClientWithEnterprise(updateClientDto: UpdateClientDto) {
    return await this.client.findUnique({
      where: { id: updateClientDto.id, enterprise: { id: updateClientDto.enterpriseId } }
    });
  }

  create(createClientDto: CreateClientDto) {
    const enterprise = this.enterprise.findFirst({where: {id: createClientDto.enterpriseId}});

    if (!enterprise) {
      throw new Error('Enterprise not found');
    }

    return this.client.create({
      data: createClientDto
    })
  }

  update(updateClientDto: UpdateClientDto) {
    const {id, ...data} = updateClientDto;

    const enterprise = this.enterprise.findFirst({where: {id: updateClientDto.enterpriseId}});

    if (!enterprise) {
      throw new Error('Enterprise not found');
    }

    return this.client.update({
      where: {id: id},
      data: data
    })
  }

  remove(id: string) {
    const client = this.client.findFirst({where: {id: id}});

    if (!client) {
      throw new Error('Client not found');
    }

    return this.client.delete({
      where: {id: id}
    });
  }
}
