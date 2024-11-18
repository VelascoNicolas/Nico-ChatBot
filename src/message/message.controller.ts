import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get(':idEnterprise')
  findAllMessages(@Param('idEnterprise') idEnterprise: string) {
    return this.messageService.findAllMessages(idEnterprise);
  }

  @Get(':id')
  findMessageById(@Param('id') id: string, @Query('idEnterprise') idEnterprise: string) {
    return this.messageService.findMessageById(id, idEnterprise);
  }

  @Get('/numOrder/:numOrder')
  findAllMessagesByNumOrder(@Query('idEnterprise') idEnterprise: string, @Query('idFlow') idFlow: string, @Param('numOrder') numOrder: number) {
    return this.messageService.findAllMessagesByNumOrder(idEnterprise, idFlow, numOrder);
  }

  @Post()
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messageService.createMessage(createMessageDto);
  }

  @Patch('/entity/:id')
  updateEntityByEnterprise(@Param('id') id: string, @Query('idEnterprise') idEnterprise: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.updateEntityByEnterprise(updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Query('idEnterprise') idEnterprise: string) {
    return this.messageService.deleteEntityByEnterprise(id, idEnterprise);
  }

  @Get('/main/:idEnterprise')
  findAllMainMessages(@Param('idEnterprise') idEnterprise: string) {
    return this.messageService.findAllMainMessages(idEnterprise);
  }

  @Get('/main/flow')
  findAllMainMessagesByFlow(@Query('idEnterprise') idEnterprise: string, @Query('idFlow') idFlow: string) {
    return this.messageService.findAllMainMessagesWithIdFlow(idEnterprise, idFlow);
  }

  @Get('/child/:parentMessageId')
  findAllChildMessages(@Param('parentMessageId') parentMessageId: string) {
    return this.messageService.findChildMessages(parentMessageId);
  }

  @Get('/messages')
  getMessagesWithMessages(@Query('idEnterprise') idEnterprise: string) {
    return this.messageService.getMessagesWithMessages(idEnterprise);
  }

  @Get('/message/:id')
  getOneWithMessages(@Query('id') id: string, @Query('idEnterprise') idEnterprise: string) {
    return this.messageService.getOneWithMessages(id, idEnterprise);
  }

  @Get('/menu/:idEnterprise')
  getMessagesWithMenuMessages(@Query('idEnterprise') idEnterprise: string) {
    return this.messageService.getMessagesWithMenuMessages(idEnterprise);
  }

  @Get('/menu/message/:id')
  getOneWithMenuMessages(@Query('id') id: string, @Query('idEnterprise') idEnterprise: string) {
    return this.messageService.getOneWithMenuMessages(id, idEnterprise);
  } 

  @Patch(':id')
  updateMessage(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.updateMessage({id: id, ...updateMessageDto});
  }
  
}
