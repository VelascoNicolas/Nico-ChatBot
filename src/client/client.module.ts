import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { ProfileModule } from '../profile/profile.module';
@Module({
  imports: [ProfileModule],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
