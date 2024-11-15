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
  
  async getEnterpriseWithPricingPlan(enterpriseId: string) {
    return await this.enterprise.findUnique({
      where: { id: enterpriseId },
      include: { pricingPlan: true }
    });
  }

  async updateEnterpriseWithPlan(enterpriseDto: UpdateEnterpriseDto) {

    const {id, ...data} = enterpriseDto;

    const pricingPlan = await this.pricingPlan.findUnique({
      where: { id: enterpriseDto.pricingPlanId }
    });

    if (!pricingPlan) {
      throw new Error('Pricing plan not found');
    }

    const enterprise = this.enterprise.findFirst({where: { id: enterpriseDto.id }});

    if (!enterprise) {
      throw new Error('Enterprise not found');
    }

    return await this.enterprise.update({
      where: {id: id},
      data: data
    })

  }

  create(createEnterpriseDto: CreateEnterpriseDto) {
    return this.enterprise.create({data: createEnterpriseDto});
  }

  findAll() {
    return this.enterprise.findMany();
  }

  findOne(id: string) {
    return this.enterprise.findFirst({where: {id: id}});
  }

  remove(id: string) {
    const data = this.findOne(id);
    if (!data) {
      throw new Error('Enterprise not found');
    }

    return this.enterprise.delete({where: {id: id}});
  }
}
