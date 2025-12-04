import { BadRequestException, Injectable } from '@nestjs/common';
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

    async acceptOrRejectBid(id: string, status: "ACCEPTED" | "REJECTED", endDate: Date) {
        const bid = await this.databaseService.bid.findUnique({
            where: { id },
            select: { id: true, taskId: true, freelancerId: true },
        });
        if (!bid) {
            throw new BadRequestException('Bid does not exist');
        }
        
        if (status === "ACCEPTED") {
            await this.databaseService.bid.update({
                where: { id },
                data: { status: BidStatus.ACCEPTED },
            });

            // if bid accepted, Create work and reject all other bids for the task
            await this.bidsHelper._createWork(bid.taskId, bid.freelancerId, endDate);
            await this.bidsHelper._rejectAllOtherBidsForTask(bid.taskId, id);

            return {
                message: `${bid.freelancerId} has been accepted for task ${bid.taskId}`,
                data: bid,
            }
        } else {
            await this.databaseService.bid.update({
                where: { id },
                data: { status: BidStatus.REJECTED },
            });
            return {
                message: `${bid.freelancerId} has been rejected for task ${bid.taskId}`,
                data: bid,
            }
        }
    }
}
