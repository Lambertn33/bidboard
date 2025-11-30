import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { DatabaseModule } from '@/database/database.module';
import { TasksHelper } from './helpers/tasks.helper';

@Module({
  imports: [DatabaseModule],
  controllers: [TasksController],
  providers: [TasksService, TasksHelper],
})
export class TasksModule {}
