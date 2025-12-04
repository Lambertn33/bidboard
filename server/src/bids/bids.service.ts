import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/database/database.service';
import { Role } from 'generated/prisma/client';
import { BidsHelper } from './helpers/bids.helper';
import { CreateBidDto } from './dto/create.dto';

@Injectable()
export class BidsService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly bidsHelper: BidsHelper,
    ) {}

    async findAll(userId: string, role: Role, currentPage = 1, limit = 10, search: string = '') {
        return this.bidsHelper._fetchBidsBasedOnUserRole(userId, role, currentPage, limit, search);
    }

    async create(data: CreateBidDto, freelancerId: string){
        const bid = await this.databaseService.bid.create({
            data: {
                ...data,
                freelancerId,
            },
        });
        return {
            message: 'Bid created successfully',
            data: bid,
        }
    }
}
