import { DatabaseService } from "@/database/database.service";
import { Injectable } from "@nestjs/common";
import { BidStatus, Role, TaskStatus } from "generated/prisma/client";

@Injectable()
export class BidsHelper {
    constructor(private readonly databaseService: DatabaseService) {}

    async _fetchBidsBasedOnUserRole(userId: string, role: Role, currentPage = 1, limit = 10) {
        const skip = (currentPage - 1) * limit;
        const take = +limit;

        const baseWhere: any = {};

        // If user is a freelancer, filter by their freelancer ID
        if (role === Role.FREELANCER) {
            const freelancer = await this.databaseService.freelancer.findUnique({
                where: { userId },
                select: { id: true },
            });

            if (freelancer) {
                baseWhere.freelancerId = freelancer.id;
            } else {
                // If freelancer record doesn't exist, return empty result
                return {
                    data: [],
                    meta: {
                        total: 0,
                        currentPage,
                        limit,
                        totalPages: 0,
                    },
                };
            }
        }

        // Combine where clauses
        const where = {
            ...baseWhere,
        };

        const select: any = {
            id: true,
            message: true,
            status: true,
            task: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                    status: true,
                    price: true,
                    project: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
        };

        // Only include freelancer details for admin
        if (role === Role.ADMIN) {
            select.freelancer = {
                select: {
                    id: true,
                    telephone: true,
                    balance: true,
                    user: {
                        select: {
                            id: true,
                            names: true,
                            email: true,
                        },
                    },
                },
            };
        }

        const [bids, total] = await Promise.all([
            this.databaseService.bid.findMany({
                skip,
                take,
                where,
                select,
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            this.databaseService.bid.count({ where }),
        ]);

        return {
            data: bids,
            meta: {
                total,
                currentPage,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async _doesTaskExist(taskId: string) {
        const task = await this.databaseService.task.findUnique({
            where: { id: taskId },
            select: { id: true },
        });
        return !!task;
    }

    async _isTaskOpen(taskId: string) {
        const task = await this.databaseService.task.findUnique({
            where: { id: taskId },
            select: { status: true },
        });
        return task?.status === TaskStatus.OPEN;
    }

    async _hasFreelancerBiddedOnTask(taskId: string, freelancerId: string) {
        const bid = await this.databaseService.bid.findFirst({
            where: { taskId, freelancerId },
            select: { id: true },
        });
        return !!bid;
    }

    // ADMIN HELPERS
    async _createWork(taskId: string, freelancerId: string, endDate: Date) {
        await this.databaseService.work.create({
            data: {
                taskId,
                freelancerId,
                endDate,
            },
        });
    }

    async _rejectAllOtherBidsForTask(taskId: string, bidId: string) {
        await this.databaseService.bid.updateMany({
            where: { 
                taskId, 
                id: { 
                    not: bidId 
                }
            },
            data: { status: BidStatus.REJECTED },
        });
    }

    //FREELANCER HELPERS
}