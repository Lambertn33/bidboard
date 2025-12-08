import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { RolesGuard } from '@/auth/roles.guard';
import { UserRole } from '@/auth/enum/role.enum';
import { Roles } from '@/auth/roles.decorator';
import { JwtGuard } from '@/auth/jwt.guard';

@Controller('admin/dashboard')
@UseGuards(JwtGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('overview')
  async getDashboardOverview() {
    return this.dashboardService.getDashboardOverview();
  }

  @Get('recent-tasks')
  async getRecentTasks() {
    return this.dashboardService.getRecentTasks();
  }

  @Get('recent-bids')
  async getRecentBids() {
    return this.dashboardService.getRecentBids();
  }

  @Get('recent-works')
  async getRecentWorks() {
    return this.dashboardService.getRecentWorks();
  }
}
