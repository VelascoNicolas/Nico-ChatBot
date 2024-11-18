import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EnterpriseService } from './enterprise.service';
import { CreateEnterpriseDto } from './dto/create-enterprise.dto';
import { UpdateEnterpriseDto } from './dto/update-enterprise.dto';
import { ApiTags, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@Controller('enterprise')
export class EnterpriseController {
  constructor(private readonly enterpriseService: EnterpriseService) {}

  @Post()
  @ApiTags('Enterprise')
  @ApiBody({
    type: CreateEnterpriseDto,
  examples: {
    example: {
      value: {
        phone: "26121164",
        name: "Enterprise name",
        pricingPlan: "4a7cd21b-6a89-4bb1-8c47-e90a2ba1907a",
        connected: true
      }
    }
  }})
  @ApiBearerAuth('bearerAuth')
  create(@Body() createEnterpriseDto: CreateEnterpriseDto) {
    return this.enterpriseService.create(createEnterpriseDto);
  }

  @Get('getEnterpriseWithPricingPlan/:id')
  @ApiTags('Enterprise')
  @ApiBearerAuth('bearerAuth')
  getEnterpriseWithPricingPlan(@Param('id') id: string) {
    return this.enterpriseService.getEnterpriseWithPricingPlan(id);
  }

  @Get()
  @ApiTags('Enterprise')
  @ApiBearerAuth('bearerAuth')
  findAll() {
    return this.enterpriseService.findAll();
  }

  @Get(':id')
  @ApiTags('Enterprise')
  @ApiBearerAuth('bearerAuth')
  findOne(@Param('id') id: string) {
    return this.enterpriseService.findOne(id);
  }

  @Patch(':id')
  @ApiTags('Enterprise')
  @ApiBearerAuth('bearerAuth')
  update(@Param('id') id: string, @Body() updateEnterpriseDto: UpdateEnterpriseDto) {
    return this.enterpriseService.updateEnterpriseWithPlan({id: id, ...updateEnterpriseDto});
  }

  @Delete(':id')
  @ApiTags('Enterprise')
  @ApiBearerAuth('bearerAuth')
  remove(@Param('id') id: string) {
    return this.enterpriseService.remove(id);
  }
}
