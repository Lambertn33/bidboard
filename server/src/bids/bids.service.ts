import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '@/database/database.service';
import { BidStatus, Role } from 'generated/prisma/client';
import { BidsHelper } from './helpers/bids.helper';
import { CreateBidDto } from './dto/create.dto';

@Injectable()
export class BidsService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly bidsHelper: BidsHelper,
    ) {}

    async findAll(userId: string, role: Role, currentPage = 1, limit = 10) {
        const bids = await this.bidsHelper._fetchBidsBasedOnUserRole(userId, role, currentPage, limit);
        return {
            data: bids.data,
            meta: bids.meta,
        };
    }

    async findOne(id: string, role: Role) {
        const bid = await this.bidsHelper._fetchBidByIdBasedOnUserRole(id, role);
        if (!bid) {
            throw new NotFoundException('Bid not found');
        }
        return {
            data: bid,
        };
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

    async acceptBid(id: string, endDate: string) {
        const bid = await this.databaseService.bid.findUnique({
            where: { id },
            select: { id: true, taskId: true, freelancerId: true, task: { select: { name: true } } },
        });

        if (!bid) {
            throw new BadRequestException('Bid does not exist');
        }


        // Update bid status to ACCEPTED
        await this.databaseService.bid.update({
            where: { id },
            data: { status: BidStatus.ACCEPTED },
        });

        // Create work and reject all other bids for the task
        await this.bidsHelper._createWorkAndUpdateTaskToAssigned(bid.taskId, bid.freelancerId, endDate);
        await this.bidsHelper._rejectAllOtherBidsForTask(bid.taskId, id);

        return {
            message: `Bid has been accepted for task ${bid.task.name}`,
            data: bid,
        };
    }

    async rejectBid(id: string) {
        const bid = await this.databaseService.bid.findUnique({
            where: { id },
            select: { id: true, taskId: true, freelancerId: true },
        });

        if (!bid) {
            throw new BadRequestException('Bid does not exist');
        }

        // Update bid status to REJECTED
        await this.databaseService.bid.update({
            where: { id },
            data: { status: BidStatus.REJECTED },
        });

        return {
            message: `Bid has been rejected for task ${bid.task.name}`,
            data: bid,
        };
    }
}
