import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { EnterpriseService } from './enterprise.service';
import { CreateEnterpriseDto } from './dto/create-enterprise.dto';
import { UpdateEnterpriseDto } from './dto/update-enterprise.dto';
import { ApiTags, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@Controller('enterprise')
export class EnterpriseController {
  constructor(private readonly enterpriseService: EnterpriseService) {}

  @ApiTags('Enterprise')
  @ApiBearerAuth('bearerAuth')
  @Get(':id')
  async getOne(@Param('id') id: string) {
    try {
      return await this.enterpriseService.getOne(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @ApiTags('Enterprise')
  @ApiBearerAuth('bearerAuth')
  @Get()
  async getAll() {
    try {
      return this.enterpriseService.getAll();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }    
  }
  
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
  async create(@Body() createEnterpriseDto: CreateEnterpriseDto) {
    try {
      return await this.enterpriseService.create(createEnterpriseDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id')
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
    }
  })
  @ApiBearerAuth('bearerAuth')
  async update(@Param('id') id: string, @Body() updateEnterpriseDto: UpdateEnterpriseDto) {
    try {
      return await this.enterpriseService.update(id, updateEnterpriseDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Delete(':id')
  @ApiTags('Enterprise')
  @ApiBearerAuth('bearerAuth')
  async softDelete(@Param('id') id: string) {
    try {
      return await this.enterpriseService.softDelete(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Patch('recover/:id')
  @ApiTags('Enterprise')
  @ApiBearerAuth('bearerAuth')
  async recover(@Param('id') id: string) {
    try {
      return await this.enterpriseService.recover(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get('/pricingplan/:id')
  @ApiTags('Enterprise')
  @ApiBearerAuth('bearerAuth')
  async getEnterpriseWithPricingPlan(@Param('id') id: string) {
    try {
      return await this.enterpriseService.getEnterpriseWithPricingPlan(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

}
