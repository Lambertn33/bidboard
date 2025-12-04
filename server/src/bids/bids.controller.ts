import { Body, Controller, Get, Post, Query, UseGuards, Put, Param } from '@nestjs/common';
import { BidsService } from './bids.service';
import { CurrentUser } from '@/auth/current-user.decorator';
import { Role } from 'generated/prisma/client';
import { JwtGuard } from '@/auth/jwt.guard';
import { CreateBidDto } from './dto/create.dto';
import { UserRole } from '@/auth/enum/role.enum';
import { RolesGuard } from '@/auth/roles.guard';
import { Roles } from '@/auth/roles.decorator';
import { AcceptBidDto } from './dto/accept.dto';

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

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: { id: string; email: string; role: Role },
  ) {
    return this.bidsService.findOne(id, user.role);
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

  @Put(':id/accept')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async acceptBid(
    @Param('id') id: string,
    @Body() data: AcceptBidDto,
  ) {
    return this.bidsService.acceptBid(id, data.endDate);
  }

  @Put(':id/reject')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async rejectBid(
    @Param('id') id: string,
  ) {
    return this.bidsService.rejectBid(id);
  }
}
