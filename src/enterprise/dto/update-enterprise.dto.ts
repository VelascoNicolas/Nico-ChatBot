import { PartialType } from '@nestjs/mapped-types';
import { CreateEnterpriseDto } from './create-enterprise.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateEnterpriseDto extends PartialType(CreateEnterpriseDto) {}
