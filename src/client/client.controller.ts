import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientService.create(createClientDto);
  }

  @Get()
  findAll(@Body() createClientDto: CreateClientDto) {
    return this.clientService.findAllClientsWithAEnterprise(createClientDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientService.findClientWithEnterprise({id, ...updateClientDto});
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientService.update({id, ...updateClientDto});
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientService.remove(id);
  }
}
