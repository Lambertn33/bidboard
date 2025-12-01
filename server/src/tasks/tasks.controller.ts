import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CurrentUser } from '@/auth/current-user.decorator';
import { Role } from 'generated/prisma/client';
import { OptionalJwtGuard } from '@/auth/optional-jwt.guard';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @UseGuards(OptionalJwtGuard)
  async findAll(
    @Query('currentPage') currentPage: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search: string = '',
    @CurrentUser() user?: { id: string; email: string; role: Role },
  ) {
    return this.tasksService.findAll(user?.role, currentPage, limit, search);
  }

  @Get(':id')
  @UseGuards(OptionalJwtGuard)
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user?: { id: string; email: string; role: Role },
  ) {
    return this.tasksService.findOne(id, user?.role);
  }
}
