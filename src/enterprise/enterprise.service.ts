import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateEnterpriseDto } from './dto/create-enterprise.dto';
import { UpdateEnterpriseDto } from './dto/update-enterprise.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class EnterpriseService extends PrismaClient implements OnModuleInit{

  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }
  
  async getOne(id: string) {
    try {
      const enterprise = await this.enterprise.findUnique({
        where: { id },
      });
      if (!enterprise || !enterprise.available || enterprise.deletedAt < new Date()) {
        throw new Error('Enterprise not found');
      }
      return enterprise;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAll() {
    try {
      return this.enterprise.findMany({
        where: {
          available: true,
          deletedAt: { gte: new Date() },
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async create(createEnterpriseDto: CreateEnterpriseDto) {
    try {
      return this.enterprise.create({
        data: {
          ...createEnterpriseDto,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id: string, updateEnterpriseDto: UpdateEnterpriseDto) {
    try {
      return this.enterprise.update({
        where: { id },
        data: updateEnterpriseDto,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async softDelete(id: string) {
    try {
      return this.enterprise.update({
        where: { id },
        data: {
          available: false,
          deletedAt: new Date(),
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async recover(id: string) {
    try {
      const enterprise = await this.enterprise.findUnique({
        where: { id },
      });
  
      if (!enterprise || enterprise.available == true) {
        throw new Error('Enterprise not found or is already active');
      }
  
      return this.enterprise.update({
        where: { id },
        data: {
          available: true,
          deletedAt: new Date('9999-12-12T00:00:00.000Z'),
        },
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getEnterpriseWithPricingPlan(enterpriseId: string) {
    try {
      const enterprise = await this.enterprise.findUnique({
        where: { id: enterpriseId },
        include: { pricingPlan: true },
      });
  
      if (!enterprise || enterprise.deletedAt < new Date() || enterprise.available == false) {
        throw new Error('Enterprise not found');
      }
  
      return enterprise;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  

  // async updateEnterpriseWithPlan(enterpriseDto: UpdateEnterpriseDto) {

  //   const {id, ...data} = enterpriseDto;

  //   const pricingPlan = await this.pricingPlan.findUnique({
  //     where: { id: enterpriseDto.pricingPlanId }
  //   });

  //   if (!pricingPlan) {
  //     throw new Error('Pricing plan not found');
  //   }

  //   const enterprise = this.enterprise.findFirst({where: { id: enterpriseDto.id }});

  //   if (!enterprise) {
  //     throw new Error('Enterprise not found');
  //   }

  //   return await this.enterprise.update({
  //     where: {id: id},
  //     data: data
  //   })

  // }

}
