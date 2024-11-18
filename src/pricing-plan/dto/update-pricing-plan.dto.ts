import { PartialType } from '@nestjs/mapped-types';
import { CreatePricingPlanDto } from './create-pricing-plan.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePricingPlanDto extends PartialType(CreatePricingPlanDto) {
    
    @IsString()
    @IsNotEmpty()
    id: string;
}
