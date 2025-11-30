import { Controller, Get, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CurrentUser } from '@/auth/current-user.decorator';
import { Role } from 'generated/prisma/client';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async findAll(
    @Query('currentPage') currentPage: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search: string = '',
    @CurrentUser() user?: { id: string; email: string; role: Role },
  ) {
    return this.tasksService.findAll(user?.role, currentPage, limit, search);
  }
}
