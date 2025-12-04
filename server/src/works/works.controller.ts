import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { WorksService } from './works.service';
import { CurrentUser } from '@/auth/current-user.decorator';
import { Role, WorkStatus } from 'generated/prisma/client';
import { JwtGuard } from '@/auth/jwt.guard';
import { Roles } from '@/auth/roles.decorator';
import { RolesGuard } from '@/auth/roles.guard';
import { UserRole } from '@/auth/enum/role.enum';
import { CompleteWorkDto } from './dto/complete.dto';

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
    return await this.worksService.findAll(currentPage, limit, user.role, user.id, workStatus);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: { id: string; email: string; role: Role },
  ) {
    return await this.worksService.findOne(id, user.role);
  }

  @Put(':id/complete')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.FREELANCER)

  async completeWork(
    @Param('id') id: string,
    @Body() body: CompleteWorkDto,
  ) {
    return await this.worksService.completeWork(id, body.completionUrl);
  }

  @Put(':id/pay')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async payWork(
    @Param('id') id: string,
  ) {
    return await this.worksService.payWork(id);
  }
}
