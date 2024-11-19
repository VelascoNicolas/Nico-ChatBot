import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FlowService } from './flow.service';
import { CreateFlowDto } from './dto/create-flow.dto';
import { UpdateFlowDto } from './dto/update-flow.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { ProfileService } from '../profile/profile.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('flow')
@ApiTags('Flow')
export class FlowController {
  constructor(
    private readonly flowService: FlowService,
    private readonly profileService: ProfileService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('flowsWithEnterprise')
  @ApiBearerAuth('bearerAuth')
  async findAllFlowsWithEnterprise(@Req() req) {
    const idEnterprise = await this.profileService.findEnterpriseByProfileId(
      req.profile.sub,
    );
    return await this.flowService.findFlowsWithEnterprise(idEnterprise);
  }

  @UseGuards(AuthGuard)
  @Get('flowsWithPricing/:pricingPlanId')
  @ApiBearerAuth('bearerAuth')
  async findAllFlowsWithPricingPlanId(
    @Param('pricingPlanId') pricingPlanId: string,
  ) {
    return await this.flowService.findFlowsWithPricingPlanId(pricingPlanId);
  }

  @UseGuards(AuthGuard)
  @Post()
  @ApiBody({
    type: CreateFlowDto,
    examples: {
      example: {
        value: {
          name: 'Flow name',
          description: 'Flow description',
          PricingPlan: [
            {
              id: 'id',
              name: 'Pricing plan name',
              description: 'Pricing plan description',
              price: 100,
            },
          ],
        },
      },
    },
  })
  @ApiBearerAuth('bearerAuth')
  async create(@Body() createFlowDto: CreateFlowDto) {
    return await this.flowService.create(createFlowDto);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiBody({
    type: UpdateFlowDto,
    examples: {
      example: {
        value: {
          name: 'Flow name',
          description: 'Flow description',
          pricingPlans: [
            {
              id: 'id',
              name: 'Pricing plan name',
              description: 'Pricing plan description',
              price: 100,
            },
          ],
        },
      },
    },
  })
  @ApiBearerAuth('bearerAuth')
  async update(@Param('id') id: string, @Body() updateFlowDto: UpdateFlowDto) {
    return await this.flowService.update({ id: id, ...updateFlowDto });
  }

  @UseGuards(AuthGuard)
  @Get('getAll')
  @ApiBearerAuth('bearerAuth')
  async getAll(@Req() req) {
    const idEnterprise = await this.profileService.findEnterpriseByProfileId(
      req.profile.sub,
    );
    return await this.flowService.getAll(idEnterprise);
  }

  @UseGuards(AuthGuard)
  @Get('OneWithMenu/:id')
  @ApiBearerAuth('bearerAuth')
  async findOneWithMenu(@Param('id') id: string, @Req() req) {
    const idEnterprise = await this.profileService.findEnterpriseByProfileId(
      req.profile.sub,
    );
    return await this.flowService.getOneWithMenuMessagesAndMessages(
      id,
      idEnterprise,
    );
  }

  @UseGuards(AuthGuard)
  @Get('getAllWithMenu')
  @ApiBearerAuth('bearerAuth')
  async getAllWithMenu(@Req() req) {
    const idEnterprise = await this.profileService.findEnterpriseByProfileId(
      req.profile.sub,
    );
    return await this.flowService.getAllWithMenu(idEnterprise);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiBearerAuth('bearerAuth')
  async delete(@Param('id') id: string) {
    return await this.flowService.softDelete(id);
  }

  @UseGuards(AuthGuard)
  @Get('BetterGetAll')
  @ApiBearerAuth('bearerAuth')
  async findAllFlowsWithMessage(@Req() req) {
    const idEnterprise = await this.profileService.findEnterpriseByProfileId(
      req.profile.sub,
    );
    return await this.flowService.findAllFlowsWithMessage(idEnterprise);
  }
}
