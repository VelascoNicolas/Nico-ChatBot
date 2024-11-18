import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateFlowDto } from './dto/create-flow.dto';
import { UpdateFlowDto } from './dto/update-flow.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class FlowService extends PrismaClient implements OnModuleInit {
  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  createFlowWithPricingPlans(createFlowDto: CreateFlowDto) {
    const pricingPlansEntities = [];

    if (createFlowDto.pricingPlans && createFlowDto.pricingPlans.length > 0) {
      createFlowDto.pricingPlans.forEach((pricingPlan) => {
        const pricing = this.pricingPlan.findFirst({
          where: { id: pricingPlan.id },
        });

        if (!pricing) {
          throw new Error(`Pricing with id ${pricingPlan.id} not found`);
        }

        pricingPlansEntities.push(pricing);
      });
    }

    return this.flow.create({
      data: {
        name: createFlowDto.name,
        description: createFlowDto.description,
        isDeleted: createFlowDto.isDeleted,
        PricingPlan: {
          connect: pricingPlansEntities.map((pricing) => ({ id: pricing.id })), // Connect flow to existing pricing plans by ID
        },
      },
    });
  }
  updateFlowWithPricingPlans(updateFlowDto: UpdateFlowDto) {
    const pricingPlansEntities = [];

    if (updateFlowDto.pricingPlans && updateFlowDto.pricingPlans.length > 0) {
      updateFlowDto.pricingPlans.forEach((pricingPlan) => {
        const pricing = this.pricingPlan.findFirst({
          where: { id: pricingPlan.id },
        });

        if (!pricing) {
          throw new Error(`Pricing with id ${pricingPlan.id} not found`);
        }

        pricingPlansEntities.push(pricing);
      });
    }

    const flow = this.flow.findFirst({where: { id: updateFlowDto.id }});

    if (!flow) {
      throw new Error(`Flow with id ${updateFlowDto.id} not found`);
    }

    return this.flow.update({
      where: { id: updateFlowDto.id },
      data: {
        name: updateFlowDto.name,
        description: updateFlowDto.description,
        isDeleted: updateFlowDto.isDeleted,
        PricingPlan: {
          connect: pricingPlansEntities.map((pricing) => ({ id: pricing.id })), // Connect flow to existing pricing plans by ID
        },
      },
    });
  }

  async getFlowsByPricingId(pricingId: string) {
    return this.flow.findMany({
      where: {
        PricingPlan: {
          some: {
            id: pricingId,
          },
        },
      },
    })
  }

  async getFlowsByPricingIdAndEnterpriseId(pricingId: string, enterpriseId: string) {
    return this.flow.findMany({
      where: {
        PricingPlan: {
          some: {
            id: pricingId,
            enterprises: {
              some: {
                id: enterpriseId,
              },
            },
          },
        }
      },
    })
  }

  async remove(id: string) {
    const flow = await this.flow.findFirst({ where: { id } });

    if (!flow) {
      throw new Error(`Flow with id ${id} not found`);
    }

    return this.flow.delete({ where: { id } });
  }

  async findAllFlowsWithMessage(idEnterprise: string) {
    const enterprise = await this.enterprise.findFirst({ where: { id: idEnterprise }, include: {pricingPlan: true}});
    if (!enterprise) {
      throw new Error(`Enterprise with id ${idEnterprise} not found`);
    }

    const enterprisePlanId = enterprise.pricingPlan.id;

    if (!enterprisePlanId) {
      throw new Error(`Enterprise with id ${idEnterprise} has no pricing plan`);
    }

    const flows = await this.flow.findMany({
      where: {
        PricingPlan: {
          some: {
            id: enterprisePlanId,
            enterprises: {
              some: {
                id: enterprise.id,
              },
            },
          },
        }
      },
      include: {
        Message: true,
      }
    })

    for(const flow of flows) {
      flow.Message = await this.message.findMany({where: {flowId: flow.id, enterpriseId: enterprise.id}});
    }

    return flows;

  }
  
}
