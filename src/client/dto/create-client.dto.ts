import { IsNotEmpty, IsString } from "class-validator";

export class CreateClientDto {

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsString()
    @IsNotEmpty()
    enterpriseId: string; 
}
