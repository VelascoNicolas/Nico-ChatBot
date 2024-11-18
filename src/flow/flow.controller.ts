import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FlowService } from './flow.service';
import { CreateFlowDto } from './dto/create-flow.dto';
import { UpdateFlowDto } from './dto/update-flow.dto';

@Controller('flow')
export class FlowController {
  constructor(private readonly flowService: FlowService) {}

}
