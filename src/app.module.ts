import { Module } from '@nestjs/common';
import { ProfileModule } from './profile/profile.module';
import { ClientModule } from './client/client.module';
import { EnterpriseModule } from './enterprise/enterprise.module';
import { FlowModule } from './flow/flow.module';
import { MessageModule } from './message/message.module';
import { PricingPlanModule } from './pricing-plan/pricing-plan.module';
import { AuthModule } from './auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';


@Module({
  imports: [ProfileModule, ClientModule, EnterpriseModule, FlowModule, MessageModule, PricingPlanModule, AuthModule,
    MulterModule.register({
      dest: './uploads', // Specify the destination directory for uploaded files
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
