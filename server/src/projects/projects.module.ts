import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { DatabaseModule } from '@/database/database.module';
import { ProjectsHelper } from './helpers/projects.helper';

@Module({
  imports: [DatabaseModule],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectsHelper],
})
export class ProjectsModule {}
