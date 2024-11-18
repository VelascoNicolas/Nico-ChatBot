import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { ProfileService } from '../profile/profile.service';
import { ApiTags, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Option, TypeMessage } from '@prisma/client';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('message')
@ApiTags('Message')
export class MessageController {
  constructor(private readonly messageService: MessageService, private readonly profileService: ProfileService) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiBody({
    type: CreateMessageDto,
  examples: {
    example: {
      value: {
        numOrder: 1,
        name: "Message name",
        body: "Message body",
        option: `${Option.MENU}`,
        typeMessage: `${TypeMessage.NAME}`,
        showName: true,
        enterpriseId: "9a8d897f-699a-454a-978f-789a897f699a",
        flowId: "b517b60e-8360-4578-9087-83604578b517",
        parentMessageId: "517b60e-8360-4578-9087-83604578b517"
      }
    }
  }})
  @ApiBearerAuth('bearerAuth')
  async create(@Body() createMessageDto: CreateMessageDto, @Req() req) {
    const idEnterprise = await this.profileService.findEnterpriseByProfileId(req.sub);
    createMessageDto.enterpriseId = idEnterprise;
    return this.messageService.createMessage(createMessageDto);
  }

  @UseGuards(AuthGuard)
  @Get('getAllWithFlow')
  @ApiBearerAuth('bearerAuth')
  async findAllMessages(@Req() req) {
    const idEnterprise = await this.profileService.findEnterpriseByProfileId(req.profile.sub);
    return this.messageService.findAllMessages(idEnterprise);
  }

  @UseGuards(AuthGuard)
  @Get('getAllMain')
  @ApiBearerAuth('bearerAuth')
  async findAllMainMessages(@Req() req) {
    const idEnterprise = await this.profileService.findEnterpriseByProfileId(req.profile.sub);
    return this.messageService.findAllMainMessages(idEnterprise);
  }

  @UseGuards(AuthGuard)
  @Get('getAllDeleted')
  @ApiBearerAuth('bearerAuth')
  async getAllDeletedMessages(@Req() req) {
    const idEnterprise = await this.profileService.findEnterpriseByProfileId(req.profile.sub);
    return this.messageService.getAllDeletedMessages(idEnterprise);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiBearerAuth('bearerAuth')
  async findOne(@Param('id') id: string, @Req() req) {
    const idEnterprise = await this.profileService.findEnterpriseByProfileId(req.profile.sub);
    return this.messageService.findMessageById(id, idEnterprise);
  }

  @UseGuards(AuthGuard)
  @Get('/flow/:flowId')
  @ApiBearerAuth('bearerAuth')
  async findAllMessagesByFlow(@Query('flowId') idFlow: string, @Param() numOrder: number, @Req() req) {
    const idEnterprise = await this.profileService.findEnterpriseByProfileId(req.profile.sub);
    return this.messageService.findAllMessagesByNumOrderAndFlowByName(idEnterprise, idFlow, numOrder);
  }

  @UseGuards(AuthGuard)
  @Get('flowName/:flowName')
  @ApiBearerAuth('bearerAuth')
  async findAllMessagesByNumOrderAndFlowByName(@Query('flowName') flowName: string, @Param() numOrder: number, @Req() req) {
    const idEnterprise = await this.profileService.findEnterpriseByProfileId(req.profile.sub);
    return this.messageService.findAllMessagesByNumOrderAndFlowByName(idEnterprise, flowName, numOrder);
  }

  @UseGuards(AuthGuard)
  @Get('messagesWithMessages')
  @ApiBearerAuth('bearerAuth')
  async getMessagesWithMessages(@Req() req) {
    const idEnterprise = await this.profileService.findEnterpriseByProfileId(req.profile.sub);
    return this.messageService.getMessagesWithMessages(idEnterprise);
  }

  @UseGuards(AuthGuard)
  @Get('messageWithMessages/:id')
  @ApiBearerAuth('bearerAuth')
  async getOneWithMessages(@Query('id') id: string, @Req() req) {
    const idEnterprise = await this.profileService.findEnterpriseByProfileId(req.profile.sub);
    return this.messageService.getOneWithMessages(id, idEnterprise);
  }

  @UseGuards(AuthGuard)
  @Get('/getMessagesWithMenu')
  @ApiBearerAuth('bearerAuth')
  async getMessagesWithMenuMessages(@Req() req) {
    const idEnterprise = await this.profileService.findEnterpriseByProfileId(req.profile.sub);
    return this.messageService.getMessagesWithMenuMessages(idEnterprise);
  }

  @UseGuards(AuthGuard)
  @Get('getMessageWithMenu/:id')
  @ApiBearerAuth('bearerAuth')
  async getOneWithMenuMessages(@Query('id') id: string, @Req() req) {
    const idEnterprise = await this.profileService.findEnterpriseByProfileId(req.profile.sub);
    return this.messageService.getOneWithMenuMessages(id, idEnterprise);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiBody({
    type: CreateMessageDto,
  examples: {
    example: {
      value: {
        numOrder: 1,
        name: "Message name",
        body: "Message body",
        option: `${Option.MENU}`,
        typeMessage: `${TypeMessage.NAME}`,
        showName: true,
        enterpriseId: "9a8d897f-699a-454a-978f-789a897f699a",
        flowId: "b517b60e-8360-4578-9087-83604578b517",
        parentMessageId: "517b60e-8360-4578-9087-83604578b517"
      }
    }
  }})
  @ApiBearerAuth('bearerAuth')
  async update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto, @Req() req) {
    const idEnterprise = await this.profileService.findEnterpriseByProfileId(req.profile.sub);
    updateMessageDto.enterpriseId = idEnterprise;
    return this.messageService.updateMessage({id:id, ...updateMessageDto});
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiBearerAuth('bearerAuth')
  async remove(@Param('id') id: string, @Req() req) {
    const idEnterprise = await this.profileService.findEnterpriseByProfileId(req.profile.sub);
    await this.messageService.deleteMessageByEnterprise(id, idEnterprise);
  }

  @UseGuards(AuthGuard)
  @Patch('restoreMessage/:id')
  @ApiBearerAuth('bearerAuth')
  async restoreMessage(@Param('id') id: string, @Req() req) {
    const idEnterprise = await this.profileService.findEnterpriseByProfileId(req.profile.sub);
    return this.messageService.restoreDeletedMessage(id, idEnterprise);
  }
 
  @UseGuards(AuthGuard)
  @Get('findAllMainMessagesWithIdFlow/:idFlow')
  @ApiBearerAuth('bearerAuth')
  async findAllMainMessagesWithIdFlow(@Param('idFlow') idFlow: string, @Req() req) {
    const idEnterprise = await this.profileService.findEnterpriseByProfileId(req.profile.sub);
    return this.messageService.findAllMainMessagesWithIdFlow(idEnterprise, idFlow);
  }
  
}
