import { IsNotEmpty, IsString } from "class-validator";

export class CreateProfileDto {
    @IsString()
    @IsNotEmpty()
    enterpriseId: string;
}
