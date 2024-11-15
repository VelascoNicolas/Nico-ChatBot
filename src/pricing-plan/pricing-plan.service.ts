import { Injectable } from '@nestjs/common';
import { CreatePricingPlanDto } from './dto/create-pricing-plan.dto';
import { UpdatePricingPlanDto } from './dto/update-pricing-plan.dto';

@Injectable()
export class PricingPlanService {
  create(createPricingPlanDto: CreatePricingPlanDto) {
    return 'This action adds a new pricingPlan';
  }

  findAll() {
    return `This action returns all pricingPlan`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pricingPlan`;
  }

  update(id: number, updatePricingPlanDto: UpdatePricingPlanDto) {
    return `This action updates a #${id} pricingPlan`;
  }

  remove(id: number) {
    return `This action removes a #${id} pricingPlan`;
  }
}
