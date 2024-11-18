import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { EnterpriseService } from './enterprise.service';
import { CreateEnterpriseDto } from './dto/create-enterprise.dto';
import { UpdateEnterpriseDto } from './dto/update-enterprise.dto';

@Controller('enterprise')
export class EnterpriseController {
  constructor(private readonly enterpriseService: EnterpriseService) {}

  @Get(':id')
  async getOne(@Param('id') id: string) {
    try {
      return await this.enterpriseService.getOne(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get()
  async getAll() {
    try {
      return this.enterpriseService.getAll();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }    
  }
  
  @Post()
  async create(@Body() createEnterpriseDto: CreateEnterpriseDto) {
    try {
      return await this.enterpriseService.create(createEnterpriseDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateEnterpriseDto: UpdateEnterpriseDto) {
    try {
      return await this.enterpriseService.update(id, updateEnterpriseDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Delete(':id')
  async softDelete(@Param('id') id: string) {
    try {
      return await this.enterpriseService.softDelete(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Patch('recover/:id')
  async recover(@Param('id') id: string) {
    try {
      return await this.enterpriseService.recover(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get('/pricingplan/:id')
  async getEnterpriseWithPricingPlan(@Param('id') id: string) {
    try {
      return await this.enterpriseService.getEnterpriseWithPricingPlan(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

}
