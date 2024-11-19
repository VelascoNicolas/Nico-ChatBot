import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateClientDto {

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

}
