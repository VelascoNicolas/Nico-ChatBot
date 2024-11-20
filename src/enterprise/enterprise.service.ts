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
    return await this.enterprises.findUnique({
      where: { id: enterpriseId, available: true },
      include: { pricingPlan: true }
    });
  }

  async updateEnterpriseWithPlan(enterpriseDto: UpdateEnterpriseDto) {

    const {id, ...data} = enterpriseDto;

    const pricingPlan = await this.pricing_plans.findUnique({
      where: { id: enterpriseDto.pricingPlanId,  available: true }
    });

    if (!pricingPlan) {
      throw new Error('Pricing plan not found');
    }

    const enterprise = this.enterprises.findFirst({where: { id: enterpriseDto.id,  available: true }});

    if (!enterprise) {
      throw new Error('Enterprise not found');
    }

    return await this.enterprises.update({
      where: {id: (await enterprise).id},
      data: data
    })

  }

  create(createEnterpriseDto: CreateEnterpriseDto) {
    return this.enterprises.create({data: createEnterpriseDto});
  }

  findAll() {
    return this.enterprises.findMany({where: {available: true}});
  }

  findOne(id: string) {
    return this.enterprises.findFirst({where: {id: id, available: true}});
  }

  remove(id: string) {
    const data = this.findOne(id);
    if (!data) {
      throw new Error('Enterprise not found');
    }

    return this.enterprises.update({where: {id: id}, data: {deletedAt: new Date(Date.now()), available: false}});
  }
}
