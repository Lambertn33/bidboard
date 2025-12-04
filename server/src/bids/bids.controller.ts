import { Body, Controller, Get, Post, Query, UseGuards, BadRequestException, Put, Param } from '@nestjs/common';
import { BidsService } from './bids.service';
import { CurrentUser } from '@/auth/current-user.decorator';
import { Role } from 'generated/prisma/client';
import { JwtGuard } from '@/auth/jwt.guard';
import { CreateBidDto } from './dto/create.dto';
import { UserRole } from '@/auth/enum/role.enum';
import { RolesGuard } from '@/auth/roles.guard';
import { Roles } from '@/auth/roles.decorator';

@Controller('bids')
@UseGuards(JwtGuard)
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  @Get()
  async findAll(
    @Query('currentPage') currentPage: number = 1,
    @Query('limit') limit: number = 10,
    @CurrentUser() user: { id: string; email: string; role: Role },
  ) {
    return this.bidsService.findAll(user.id, user.role, currentPage, limit);
  }

  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.FREELANCER)
  async create(
    @Body() data: CreateBidDto,
    @CurrentUser() user: { id: string; email: string; role: Role; freelancer?: { id: string } },
  ) {
    return this.bidsService.create(data, user.freelancer!.id);
  }

  @Put(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async acceptOrRejectBid(
    @Param('id') id: string,
    @Body() data: { status:  "ACCEPTED" | "REJECTED", endDate: Date },
  ) {
    return this.bidsService.acceptOrRejectBid(id, data.status, data.endDate);
  }
}
