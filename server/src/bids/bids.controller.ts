import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { BidsService } from './bids.service';
import { CurrentUser } from '@/auth/current-user.decorator';
import { Role } from 'generated/prisma/client';
import { JwtGuard } from '@/auth/jwt.guard';

@Controller('bids')
@UseGuards(JwtGuard)
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  @Get()
  async findAll(
    @Query('currentPage') currentPage: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search: string = '',
    @CurrentUser() user: { id: string; email: string; role: Role },
  ) {
    return this.bidsService.findAll(user.id, user.role, currentPage, limit, search);
  }
}
