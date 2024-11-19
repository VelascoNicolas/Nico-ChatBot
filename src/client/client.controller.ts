import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Req, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Request } from 'express';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiTags, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Client')
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @UseGuards(AuthGuard)
  @Get()
  @ApiBearerAuth('bearerAuth')
  async getAllEntitiesForAEnterprise(@Req() req: Request) {
    try {
      const profileId = req['profile'].sub;
      return this.clientService.getAllEntitiesForAEnterprise(profileId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @UseGuards(AuthGuard)
  @Get('deleted')
  @ApiBearerAuth('bearerAuth')
  async getAllDeletedEntitiesForAEnterprise(@Req() req: Request) {
    try {
      const profileId = req['profile'].sub;
      return this.clientService.getAllDeletedEntitiesForAEnterprise(profileId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @UseGuards(AuthGuard)
  @Get(':idClient')
  @ApiBearerAuth('bearerAuth')
  async getByIdEntityForAEnterprise(@Req() req: Request, @Param('idClient') idClient: string) {
    try {
      const profileId = req['profile'].sub;
      return this.clientService.getByIdEntityForAEnterprise(profileId, idClient);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @UseGuards(AuthGuard)
  @Post()
  @ApiBody({
    type: CreateClientDto,
  examples: {
    example: {
      value: {
        username: "Client name",
        phone: "26121164"
      }
    }
  }})
  @ApiBearerAuth('bearerAuth')
  async createEntityForAEnterprise(@Req() req: Request, @Body() data: CreateClientDto) {
    try {
      const profileId = req['profile'].sub;
      return this.clientService.createEntityForAEnterprise(profileId, data);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Put(':idClient')
  @ApiBody({
    type: CreateClientDto,
  examples: {
    example: {
      value: {
        username: "Client name",
        phone: "26121164"
      }
    }
  }})
  @ApiBearerAuth('bearerAuth')
  async updateEntityForAEnterprise(
    @Req() req: Request,
    @Param('idClient') idClient: string,
    @Body() data: Partial<UpdateClientDto>,
  ) {
    try {
      const profileId = req['profile'].sub;
      return this.clientService.updateEntityForAEnterprise(profileId, idClient, data);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  // @UseGuards(AuthGuard)
  // @Delete(':idClient')
  // @ApiBearerAuth('bearerAuth')
  // async deleteEntityForAEnterprise(@Req() req: Request, @Param('idClient') idClient: string) {
  //   try {
  //     const profileId = req['profile'].sub;
  //     return this.clientService.deleteEntityForAEnterprise(profileId, idClient);
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.NOT_FOUND);
  //   }
  // }

  @UseGuards(AuthGuard)
  @Delete('softdelete/:idClient')
  @ApiBearerAuth('bearerAuth')
  async logicDeleteForAEnterprise(@Req() req: Request, @Param('idClient') idClient: string) {
    try {
      const profileId = req['profile'].sub;
      return this.clientService.logicDeleteForAEnterprise(profileId, idClient);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @UseGuards(AuthGuard)
  @Post('restore/:idClient')
  @ApiBearerAuth('bearerAuth')
  async restoreLogicDeletedForAEnterprise(@Req() req: Request, @Param('idClient') idClient: string) {
    try {
      const profileId = req['profile'].sub;
      return this.clientService.restoreLogicDeletedForAEnterprise(profileId, idClient);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
