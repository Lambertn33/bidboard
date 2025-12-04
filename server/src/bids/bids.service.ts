import { BadRequestException, Injectable } from '@nestjs/common';
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
        return this.bidsHelper._fetchBidsBasedOnUserRole(userId, role, currentPage, limit);
    }

    async create(data: CreateBidDto, freelancerId: string){
        const doesTaskExist = await this.bidsHelper._doesTaskExist(data.taskId);
        if (!doesTaskExist) {
            throw new BadRequestException('Task does not exist');
        }

        const isTaskOpen = await this.bidsHelper._isTaskOpen(data.taskId);
        if (!isTaskOpen) {
            throw new BadRequestException('Task is not available for bidding');
        }

        const hasFreelancerBiddedOnTask = await this.bidsHelper._hasFreelancerBiddedOnTask(data.taskId, freelancerId);
        if (hasFreelancerBiddedOnTask) {
            throw new BadRequestException('You have already bid on this task');
        }

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
