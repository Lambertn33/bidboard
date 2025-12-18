import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { BidsModule } from './bids/bids.module';
import { WorksModule } from './works/works.module';
import { DashboardModule as AdminDashboardModule } from './admin/dashboard/dashboard.module';
import { SessionsModule } from './sessions/sessions.module';

@Module({
  imports: [AuthModule, DatabaseModule, ProjectsModule, TasksModule, BidsModule, WorksModule, AdminDashboardModule, SessionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
