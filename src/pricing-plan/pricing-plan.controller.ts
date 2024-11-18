import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { PricingPlanService } from './pricing-plan.service';
import { CreatePricingPlanDto } from './dto/create-pricing-plan.dto';
import { UpdatePricingPlanDto } from './dto/update-pricing-plan.dto';

@Controller('pricingplan')
export class PricingPlanController {
  constructor(private readonly pricingPlanService: PricingPlanService) {}

  @Post()
  async create(@Body() createPricingPlanDto: CreatePricingPlanDto) {
    try {
      return await this.pricingPlanService.create(createPricingPlanDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async getAll() {
    try {
      return await this.pricingPlanService.getAll();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    try {
      return await this.pricingPlanService.getOne(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePricingPlanDto: UpdatePricingPlanDto) {
    try {
      return await this.pricingPlanService.update(id, updatePricingPlanDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Delete(':id')
  async softDelete(@Param('id') id: string) {
    try {
      await this.pricingPlanService.softDelete(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Patch('/recover/:id')
  async recover(@Param('id') id: string) {
    try {
      return await this.pricingPlanService.recover(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
