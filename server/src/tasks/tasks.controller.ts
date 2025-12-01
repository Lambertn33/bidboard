import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CurrentUser } from '@/auth/current-user.decorator';
import { Role } from 'generated/prisma/client';
import { OptionalJwtGuard } from '@/auth/optional-jwt.guard';
import { JwtGuard } from '@/auth/jwt.guard';
import { Roles } from '@/auth/roles.decorator';
import { UserRole } from '@/auth/enum/role.enum';
import { CreateTaskDto } from './dto/create.dto';
import { RolesGuard } from '@/auth/roles.guard';
import { UpdateTaskDto } from './dto/update.dto';

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

  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() body: CreateTaskDto) {
    return this.tasksService.create(body);
  }

  @Put(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(@Param('id') id: string, @Body() body: UpdateTaskDto) {
    return this.tasksService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async delete(@Param('id') id: string) {
    return this.tasksService.delete(id);
  }
}
