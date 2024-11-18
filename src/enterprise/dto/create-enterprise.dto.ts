import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateEnterpriseDto {

    @IsString()
    name: string;

    @IsString()
    phone: string;

    @IsBoolean()
    connected: boolean;

    @IsString()
    pricingPlanId: string;
}
