import { HttpException, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateFlowDto } from './dto/create-flow.dto';
import { UpdateFlowDto } from './dto/update-flow.dto';
import { PrismaClient } from '@prisma/client';
import { MessageService } from '../message/message.service';


@Injectable()
export class FlowService extends PrismaClient implements OnModuleInit {
  constructor(private readonly messageService: MessageService) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async findFlowsWithEnterprise(idEnterprise: string) {
    const enterprise = await this.enterprises.findFirst({
      where: { id: idEnterprise, available: true },
      include: { pricingPlan: true },
    });

    if (!enterprise) {
      throw new Error(`Enterprise with id ${idEnterprise} not found`);
    }
    const pricingPlan = await this.pricing_plans.findUnique({
      where: { id: enterprise.pricingPlanId },
      include: { flows: true },
    });

    if (!pricingPlan) {
      throw new Error(`Enterprise with id ${idEnterprise} has no pricing plan`);
    }
    const flowx = pricingPlan.flows;

    const {flows, ...data} = pricingPlan;

    return {Flows: flowx, pricingPlan: data};
  }

  async findFlowsWithPricingPlanId(pricingPlanId: string) {
    const pricingPlan = await this.pricing_plans.findUnique({
      where: { id: pricingPlanId, available: true},
      include: { flows: true },
    });

    if (!pricingPlan) {
      throw new Error(`Pricing plan with id ${pricingPlanId} not found`);
    }

    return pricingPlan.flows;
  }

  async create(createFlowDto: CreateFlowDto) {
    for (const flowDto of createFlowDto.PricingPlan) {
      const pricingPlan = await this.pricing_plans.findUnique({
        where: { id: flowDto.id, available: true },
      });
      if (!pricingPlan) {
        throw new HttpException(`Pricing plan with id ${flowDto.id} not found`, 404);
      }
    }

    const flow = await this.flows.create({
      data: {
        ...createFlowDto,
        PricingPlan: {
          connect: createFlowDto.PricingPlan.map((plan) => ({ id: plan.id })),
        },
      },
      include: { PricingPlan: true },
    });

    return flow;
  }

  async update(updateFlowDto: UpdateFlowDto) {
    const flow = await this.flows.findUnique({
      where: { id: updateFlowDto.id, available: true},
      include: { PricingPlan: true },
    });

    if (!flow) {
      throw new Error(`Flow with id ${updateFlowDto.id} not found`);
    }

    for (const price of updateFlowDto.PricingPlan) {
      const pricingPlan = await this.pricing_plans.findUnique({
        where: { id: price.id, available: true },
      });
      if (!pricingPlan) {
        throw new Error(`Pricing plan with id ${price.id} not found`);
      }
    }

    return this.flows.update({
      where: { id: updateFlowDto.id },
      data: {
        name: updateFlowDto.name,
        description: updateFlowDto.description,
        PricingPlan: {
          set: updateFlowDto.PricingPlan.map((plan) => ({ id: plan.id })),
        },
      },
      include: { PricingPlan: true },
    });
  }

  async getAll(enterpriseId: string) {
    const enterprise = await this.enterprises.findFirst({
      where: { id: enterpriseId, available: true },
      include: { pricingPlan: true },
    });
    if (!enterprise) {
      throw new Error(`Enterprise with id ${enterpriseId} not found`);
    }

    const pricingPlan = await this.pricing_plans.findUnique({
      where: { id: enterprise.pricingPlanId, available: true },
      include: { flows: true },
    });

    if (!pricingPlan) {
      throw new Error(`Enterprise with id ${enterpriseId} has no pricing plan`);
    }

    const flows = await this.flows.findMany({
      where: { available: true },
      include: { Message: true },
    });

    if (flows.length === 0) {
      return [];
    }

    const allMessageWithSub =
      await this.messageService.findMessagesWithMessages(enterprise.id);

    for (const flow of flows) {
      flow.Message = allMessageWithSub
        .filter((message) => message.flow && message.flow.id === flow.id)
        .map((message) => {
          const { flow, ...messageWithoutFlow } = message;
          return messageWithoutFlow;
        });
    }

    return flows;
  }

  async getOneWithMenuMessagesAndMessages(id: string, idEnterprise: string) {
    const flow = await this.flows.findUnique({
      where: { id: id, available: true },
      include: { Message: true },
    });

    if (!flow) {
      throw new Error(`Flow with id ${id} not found`);
    }

    const allMessageWithSub =
      await this.messageService.getMessagesWithMenuMessages(idEnterprise);

    flow.Message = allMessageWithSub
      .filter((message) => message.flow && message.flow.id === flow.id)
      .map((message) => {
        const { flow, ...messageWithoutFlow } = message;
        return messageWithoutFlow;
      });
    
    return flow;
  }

  async getAllWithMenu(idEnterprise: string) {
    const enterprise = await this.enterprises.findFirst({
      where: { id: idEnterprise, available: true},
      include: { pricingPlan: true },
    });

    if (!enterprise) {
      throw new Error(`Enterprise with id ${idEnterprise} not found`);
    }

    const enterprisePlan = this.pricing_plans.findFirst({where: {id: enterprise.pricingPlanId, available: true}});

    if (!enterprisePlan) {
      throw new Error(`Enterprise with id ${idEnterprise} has no pricing plan`);
    }

    const flows = await this.flows.findMany({
      where: { available: true },
      include: { Message: true },
    });

    if (flows.length === 0) {
      return [];
    }

    const allMessageWithSubMessages = await this.messageService.getMessagesWithMenuMessages(enterprise.id);

    for (const flow of flows) {
      flow.Message = allMessageWithSubMessages
        .filter((message) => message.flow && message.flow.id === flow.id)
        .map((message) => {
          const { flow, ...messageWithoutFlow } = message;
          return messageWithoutFlow;
      });
    }

    return flows;
  }

  async softDelete(id: string) {
    const flow = await this.flows.findUnique({ where: { id, available: true}, include: {Message: true} });

    if (!flow) {
      throw new Error(`Flow with id ${id} not found`);
    }

    const message = await this.flows.update({
      where: { id },
      data: { available: false },
      include: { Message: true },
    })

    return message;
  }

  async findAllFlowsWithMessage(idEnterprise: string) {
    const enterprise = await this.enterprises.findFirst({
      where: { id: idEnterprise },
      include: { pricingPlan: true },
    });
    if (!enterprise) {
      throw new Error(`Enterprise with id ${idEnterprise} not found`);
    }

    const enterprisePlanId = enterprise.pricingPlan.id;

    if (!enterprisePlanId) {
      throw new Error(`Enterprise with id ${idEnterprise} has no pricing plan`);
    }

    const flows = await this.flows.findMany({
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
        },
      },
      include: {
        Message: true,
      },
    });

    for (const flow of flows) {
      flow.Message = await this.messageService.findAllMainMessagesWithIdFlow(
        idEnterprise,
        flow.id,
      );
    }

    return flows;
  }
}
