import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { BidsModule } from './bids/bids.module';

@Module({
  imports: [AuthModule, DatabaseModule, ProjectsModule, TasksModule, BidsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
