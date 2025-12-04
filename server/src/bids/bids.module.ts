import { Module } from '@nestjs/common';
import { BidsService } from './bids.service';
import { BidsController } from './bids.controller';
import { DatabaseModule } from '@/database/database.module';
import { BidsHelper } from './helpers/bids.helper';

@Module({
  imports: [DatabaseModule],
  controllers: [BidsController],
  providers: [BidsService, BidsHelper],
})
export class BidsModule {}
