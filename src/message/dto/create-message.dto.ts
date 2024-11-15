import { Option, TypeMessage } from "@prisma/client";
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { OptionList } from "../enum/option.enum";

export class CreateMessageDto {

    @IsNumber()
    @IsNotEmpty()
    numOrder: number;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    body: string;

    @IsEnum(OptionList, {
        message: `valid options are: ${OptionList}`
    })
    option: Option;

    @IsEnum(TypeMessage, {
        message: `valid types are: ${TypeMessage}`
    })
    TypeMessage: TypeMessage;

    @IsBoolean()
    @IsNotEmpty()
    showName: boolean;

    @IsBoolean()
    @IsNotEmpty()
    isDeleted: boolean;

    @IsString()
    @IsNotEmpty()
    enterpriseId: string;

    @IsString()
    @IsNotEmpty()
    flowId: string;

    @IsString()
    @IsNotEmpty()
    parentMessageId: string;
}
