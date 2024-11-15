import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsBoolean, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { CreatePricingPlanDto } from "src/pricing-plan/dto/create-pricing-plan.dto";
import { UpdatePricingPlanDto } from "src/pricing-plan/dto/update-pricing-plan.dto";

export class CreateFlowDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsBoolean()
    @IsNotEmpty()
    isDeleted: boolean;

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type( () => UpdatePricingPlanDto)
    pricingPlans: UpdatePricingPlanDto[];
}
