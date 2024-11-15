import { PartialType } from '@nestjs/mapped-types';
import { CreateFlowDto } from './create-flow.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateFlowDto extends PartialType(CreateFlowDto) {

    @IsString()
    @IsNotEmpty()
    id: string;
}
