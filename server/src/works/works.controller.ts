import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { WorksService } from './works.service';
import { CurrentUser } from '@/auth/current-user.decorator';
import { Role, WorkStatus } from 'generated/prisma/client';
import { JwtGuard } from '@/auth/jwt.guard';

@Controller('works')
@UseGuards(JwtGuard)
export class WorksController {
  constructor(private readonly worksService: WorksService) {}

  @Get()
  async findAll(
    @Query('currentPage') currentPage: number = 1,
    @Query('limit') limit: number = 10,
    @CurrentUser() user: { id: string; email: string; role: Role },
    @Query('workStatus') workStatus?: WorkStatus,
  ) {
    return await this.worksService.findAll(currentPage, limit, user.role, workStatus);
  }
}
