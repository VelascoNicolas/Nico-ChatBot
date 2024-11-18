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

  async createMessage(messageDto: CreateMessageDto) {
    const enterprise = await this.enterprise.findUnique({where: {id: messageDto.enterpriseId, available: true}, include: {pricingPlan: true}});

    if (!enterprise) {
      throw new Error(`Enterprise with id ${messageDto.enterpriseId} not found`);
    }

    if(enterprise.pricingPlanId === null) {
      throw new Error(`Enterprise with id ${messageDto.enterpriseId} has no pricing plan`);
    }

    const flow = await this.flow.findUnique({where: {id: messageDto.flowId, available: true}, include: {PricingPlan: true}});

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
        parentMessageId: messageDto.parentMessageId,
      }
    });

    return message;
  }

  async findAllMessages(idEnterprise: string) {
    return await this.message.findMany({where: {enterpriseId: idEnterprise, available: true}, include: {enterprise: true, flow: true}});
  }

  async findAllMainMessages(idEnterprise: string) {
    const messages = await this.message.findMany({where: {enterpriseId: idEnterprise, parentMessageId: null, available: true}, include: {enterprise: true, childMessages: true}, orderBy: { numOrder: 'asc' }});
  
    for(const message of messages) {
      (message as any).childMessages.forEach((messagito: any) => {
        messagito.childMessages = this.findChildMessages(message.id)
      });
    }
  
  
    return messages;
  }

  async getAllDeletedMessages(idEnterprise: string) {
    const enterprise = await this.enterprise.findUnique({where: {id: idEnterprise, available: true}});

    if (!enterprise) {
      throw new Error(`Enterprise with id ${idEnterprise} not found`);
    }

    const messages = await this.message.findMany({where: {enterpriseId: idEnterprise, available: false}, include: {flow: true, enterprise: true}});
  
    if(messages.length <= 0) {
      throw new Error(`No messages found for enterprise ${idEnterprise}`);
    }

    return messages;
  }

  async findMessageById(id: string, idEnterprise: string) {
    const message = await this.message.findUnique({where: {id, enterpriseId: idEnterprise, available: true}, include: {enterprise: true}});

    if (!message) {
      throw new Error(`Message with id ${id} not found`);
    }

    return message;
  }

  async findAllMessagesByNumOrder(idEnterprise: string, idFlow: string, numOrder: number) {

    const enterprise = await this.enterprise.findUnique({where: {id: idEnterprise, available: true}});

    if (!enterprise) {
      throw new Error(`Enterprise with id ${idEnterprise} not found`);
    }

    const flow = await this.flow.findUnique({where: {id: idFlow, available: true}});

    if (!flow) {
      throw new Error(`Flow with id ${idFlow} not found`);
    }

    const messages = await this.message.findMany({where: {enterpriseId: enterprise.id, numOrder: numOrder, flowId: flow.id, available: true}});

    if(messages.length <= 0) {
      throw new Error(`No messages found for numOrder ${numOrder} in flow ${idFlow}`);
    }

    return messages;
  }

  async findAllMessagesByNumOrderAndFlowByName(idEnterprise: string, nameFlow: string, numOrder: number) {
    
    const enterprise = await this.enterprise.findUnique({where: {id: idEnterprise, available: true}});

    if (!enterprise) {
      throw new Error(`Enterprise with id ${idEnterprise} not found`);
    }
    
    const flow = await this.flow.findFirst({where: {name: nameFlow, available: true}});

    if (!flow) {
      throw new Error(`Flow with name ${nameFlow} not found`);
    }

    const messages = await this.message.findMany({where: {enterpriseId: idEnterprise, numOrder: numOrder, flowId: flow.id, available: true}});

    if(messages.length <= 0) {
      throw new Error(`No messages found for numOrder ${numOrder} in flow ${nameFlow}`);
    }

    return messages;
  }

  async getMessagesWithMessages(idEnterprise: string) {

    const messages = await this.message.findMany({
      where: {
        enterprise: {
          id: idEnterprise,
        },
        available: true,
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
        available: true
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
        available: true,
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
        available: true,
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
    
    const enterprise = await this.enterprise.findUnique({where: {id: message.enterpriseId, available: true}});

    if (!enterprise) {
      throw new Error(`Enterprise with id ${message.enterpriseId} not found`);
    }

    const flow = await this.flow.findUnique({where: {id: message.flowId, available: true}});

    if (!flow) {
      throw new Error(`Flow with id ${message.flowId} not found`);
    }

    const messageToUpdate = await this.message.findUnique({where: {id: message.id, enterpriseId: enterprise.id, flowId: flow.id, available: true}});

    if (!messageToUpdate) {
      throw new Error(`Message with id ${message.id} not found`);
    }

    const updated = await this.message.update({
      where: {id: message.id},
      data: message
    })

    return updated;
  }

  async deleteMessageByEnterprise(id: string, idEnterprise: string) {
    const message = await this.message.findUnique({where: {id, enterpriseId: idEnterprise, available: true}});

    if (!message) {
      throw new Error(`Message with id ${id} not found`);
    }   
   
    const deleted = await this.message.update({where: {id, enterpriseId: idEnterprise}, data: {available: false}});

    return 'message deleted successfully';
  }

  async restoreDeletedMessage(id: string, idEnterprise: string) {
    const message = await this.message.findUnique({where: {id, enterpriseId: idEnterprise, available: false}});

    if (!message) {
      throw new Error(`Message with id ${id} not eliminated or not exist`);
    }

    const restored = await this.message.update({where: {id, enterpriseId: idEnterprise}, data: {available: true}});

    return restored;
  }

  async findAllMainMessagesWithIdFlow(idEnterprise: string, idFlow: string) {
    const messages = await this.message.findMany({where: {enterpriseId: idEnterprise, parentMessageId: null, flowId: idFlow, available: true}, include: {enterprise: true}, orderBy: { numOrder: 'asc' }});
  
    for(const message of messages) {
      (message as any).childMessages.forEach((messagito: any) => {
        messagito.childMessages = this.findChildMessages(message.id)
      });
    }

    return messages;
  }

  //Este metodo no necesita tener endpoint
  async findChildMessages(parentMessageId: string) {
    const childMessages = await this.message.findMany({
      where: {parentMessageId: parentMessageId, available: true},
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
}
