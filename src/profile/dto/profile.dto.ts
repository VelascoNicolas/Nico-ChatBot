import { Exclude, Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from "class-validator";
import { Rol } from "../enum/rol.enum";
import { CreateEnterpriseDto } from "src/enterprise/dto/create-enterprise.dto";
import { Enterprise } from "@prisma/client";

export class ProfileDto {

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsStrongPassword()
    @Exclude()
    password: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsEnum(Rol, {
        message: `Invalid role. The valid roles are ${Object.values(Rol)}`,
    })
    role: Rol;

    @IsString()
    @IsOptional()
    @Type(() => CreateEnterpriseDto)
    enterprise?: Enterprise;
}