import { Module } from '@nestjs/common';
import { WorksService } from './works.service';
import { WorksController } from './works.controller';
import { DatabaseModule } from '@/database/database.module';
import { WorksHelper } from './helpers/works.helper';

@Module({
  imports: [DatabaseModule],
  controllers: [WorksController],
  providers: [WorksService, WorksHelper],
})
export class WorksModule {}
