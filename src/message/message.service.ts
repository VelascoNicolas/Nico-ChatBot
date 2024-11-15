import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class MessageService extends PrismaClient implements OnModuleInit{

  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async findAllMessages(idEnterprise: string) {
    return await this.message.findMany({where: {enterpriseId: idEnterprise}, include: {enterprise: true}});
  }

  async findMessageById(id: string, idEnterprise: string) {
    const message = await this.message.findUnique({where: {id, enterpriseId: idEnterprise}, include: {enterprise: true}});

    if (!message) {
      throw new Error(`Message with id ${id} not found`);
    }

    return message;
  }

  async findAllMessagesByNumOrder(idEnterprise: string, idFlow: string, numOrder: number) {
    const flow = await this.flow.findUnique({where: {id: idFlow}});

    if (!flow) {
      throw new Error(`Flow with id ${idFlow} not found`);
    }

    const messages = await this.message.findMany({where: {enterpriseId: idEnterprise, numOrder: numOrder, flowId: flow.id}});

    if(messages.length <= 0) {
      throw new Error(`No messages found for numOrder ${numOrder} in flow ${idFlow}`);
    }

    return messages;
  }

  async findAllMessagesByNumOrderAndFlowByName(idEnterprise: string, nameFlow: string, numOrder: number) {
    const flow = await this.flow.findFirst({where: {name: nameFlow}});

    if (!flow) {
      throw new Error(`Flow with name ${nameFlow} not found`);
    }

    const messages = await this.message.findMany({where: {enterpriseId: idEnterprise, numOrder: numOrder, flowId: flow.id}});

    if(messages.length <= 0) {
      throw new Error(`No messages found for numOrder ${numOrder} in flow ${nameFlow}`);
    }

    return messages;
  }

  async createMessage(messageDto: CreateMessageDto) {
    const enterprise = await this.enterprise.findUnique({where: {id: messageDto.enterpriseId}, include: {pricingPlan: true}});

    if (!enterprise) {
      throw new Error(`Enterprise with id ${messageDto.enterpriseId} not found`);
    }

    if(enterprise.pricingPlanId === null) {
      throw new Error(`Enterprise with id ${messageDto.enterpriseId} has no pricing plan`);
    }

    const flow = await this.flow.findUnique({where: {id: messageDto.flowId}, include: {PricingPlan: true}});

    if (!flow) {
      throw new Error(`Flow with id ${messageDto.flowId} not found`);
    }

    for(const price of flow.PricingPlan) {
      if (price.id !== enterprise.pricingPlan.id) {
        throw new Error(`Flow with id ${messageDto.flowId} does not belong to the same pricing plan as the enterprise`);
      }
    }

    const flowPlans = flow.PricingPlan;
    const isFlowEnterprisePlan = flowPlans.some(
      (plan) => plan.id === enterprise.pricingPlan.id
    )

    if (!isFlowEnterprisePlan) {
      throw new Error(`Flow with id ${messageDto.flowId} does not belong to the same pricing plan as the enterprise`);
    }

    const message = await this.message.create({      
      data: {
        enterpriseId: enterprise.id,
        flowId: flow.id,
        numOrder: messageDto.numOrder,
        name: messageDto.name,
        body: messageDto.body,
        option: messageDto.option,
        typeMessage: messageDto.TypeMessage,
        showName: messageDto.showName,
        isDeleted: messageDto.isDeleted,
        parentMessageId: messageDto.parentMessageId,
      }
    });

    return message;
  }

  async updateEntityByEnterprise(updateMessageDto: UpdateMessageDto) {
    const updatedMessage = await this.message.update({
      where: {id: updateMessageDto.id, enterpriseId: updateMessageDto.enterpriseId},
      data: {
        enterpriseId: updateMessageDto.enterpriseId,
        flowId: updateMessageDto.flowId,
        name: updateMessageDto.name,
        body: updateMessageDto.body,
        option: updateMessageDto.option,
        typeMessage: updateMessageDto.TypeMessage,
        showName: updateMessageDto.showName,
        isDeleted: updateMessageDto.isDeleted,
        parentMessageId: updateMessageDto.parentMessageId
      }
    });

    return updatedMessage;
  }

  async deleteEntityByEnterprise(id: string, idEnterprise: string) {
    const message = await this.message.delete({where: {id, enterpriseId: idEnterprise}});

    if (!message) {
      throw new Error(`Message with id ${id} not found`);
    }

    return message;
  }

  async findAllMainMessages(idEnterprise: string) {
    const messages = await this.message.findMany({where: {enterpriseId: idEnterprise, parentMessageId: null}, include: {enterprise: true, childMessages: true}, orderBy: { numOrder: 'asc' }});
  
    for(const message of messages) {
      (message as any).childMessages.forEach((messagito: any) => {
        messagito.childMessages = this.findChildMessages(message.id)
      });
    }
  
  
    return messages;
  }

  async findAllMainMessagesWithIdFlow(idEnterprise: string, idFlow: string) {
    const messages = await this.message.findMany({where: {enterpriseId: idEnterprise, parentMessageId: null, flowId: idFlow}, include: {enterprise: true}, orderBy: { numOrder: 'asc' }});
  
    for(const message of messages) {
      (message as any).childMessages.forEach((messagito: any) => {
        messagito.childMessages = this.findChildMessages(message.id)
      });
    }
  
  
    return messages;
  }

  async findChildMessages(parentMessageId: string) {
    const childMessages = await this.message.findMany({
      where: {parentMessageId: parentMessageId},
      orderBy: {numOrder: 'asc'},
      include: {childMessages: true}
    });

    for(const child of childMessages) {
      if(child.childMessages.length > 0) {
        child.childMessages = await this.findChildMessages(child.id);
      }
    }

    return childMessages;
  }

  async getMessagesWithMessages(idEnterprise: string) {

    const messages = await this.message.findMany({
      where: {
        enterprise: {
          id: idEnterprise,
        },
      },
      include: {
        flow: true,
        childMessages: {
          include: {
            childMessages: {
              include: {
                childMessages: true,
              },
            },
          },
        },
      },
      orderBy: {
        numOrder: 'asc',
      },
    });

    if(!messages || messages.length <= 0) {
      throw new Error(`No messages found for enterprise ${idEnterprise}`);
    }

    return messages;
  }

  async getOneWithMessages(id: string, idEnterprise: string) {
    const message = await this.message.findFirst({
      where: {
        enterprise: {
          id: idEnterprise,
        },
      },
      include: {
        flow: true,
        childMessages: {
          include: {
            childMessages: {
              include: {
                childMessages: true,
              },
            },
          },
        },
      },
      orderBy: {
        numOrder: 'asc',
      },
    });

    if(!message) {
      throw new Error(`No message found for enterprise ${idEnterprise} and message ${id}`);
    }

    return message;
  }

  async getMessagesWithMenuMessages(idEnterprise: string) {
    const messages = await this.message.findMany({
      where: {
        enterprise: {
          id: idEnterprise,
        },
        option: "MENU",
      },
      include: {
        flow: true,
        childMessages: {
          include: {
            childMessages: {
              include: {
                childMessages: true,
              },
            },
          },
        },
      },
      orderBy: {
        numOrder: 'asc',
      },
    });

    if(!messages || messages.length <= 0) {
      throw new Error(`No messages found for enterprise ${idEnterprise}`);
    }

    return messages;
  }

  async getOneWithMenuMessages(id: string, idEnterprise: string) {
    const message = await this.message.findFirst({
      where: {
        enterprise: {
          id: idEnterprise,
        },
        option: "MENU",
      },
      include: {
        flow: true,
        childMessages: {
          include: {
            childMessages: {
              include: {
                childMessages: true,
              },
            },
          },
        },
      },
      orderBy: {
        numOrder: 'asc',
      },
    });

    if(!message) {
      throw new Error(`No message found for enterprise ${idEnterprise} and message ${id}`);
    }

    return message;
  }

  async updateMessage( message: UpdateMessageDto) {
    
    const enterprise = await this.enterprise.findUnique({where: {id: message.enterpriseId}});

    if (!enterprise) {
      throw new Error(`Enterprise with id ${message.enterpriseId} not found`);
    }

    const flow = await this.flow.findUnique({where: {id: message.flowId}});

    if (!flow) {
      throw new Error(`Flow with id ${message.flowId} not found`);
    }

    const updated = await this.message.update({
      where: {id: message.id},
      data: message
    })

    return updated;
  }

  
}
