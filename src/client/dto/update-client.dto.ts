import { PartialType } from '@nestjs/mapped-types';
import { CreateClientDto } from './create-client.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateClientDto extends PartialType(CreateClientDto) {
    
    @IsString()
    @IsNotEmpty()
    id: string;
}
