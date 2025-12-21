import { PaymentStatus, Role, WorkStatus } from "generated/prisma/client";
import { DatabaseService } from "@/database/database.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class WorksHelper {
    constructor(private readonly databaseService: DatabaseService) {}

    async _fetchWorksBasedOnUserRole(currentPage = 1, limit = 10, role: Role, userId: string, workStatus?: WorkStatus) {
        const skip = (currentPage - 1) * limit;
        const take = +limit;

        const where: any = {};

        if (workStatus) {
            where.status = workStatus;
        }

        if (role === Role.FREELANCER) {
            const freelancer = await this.databaseService.freelancer.findUnique({
                where: { userId },
                select: { id: true },
            });

            if (freelancer) {
                where.freelancerId = freelancer.id;
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

        const select: any = {
            id: true,
            startDate: true,
            endDate: true,
            completionUrl: true,
            status: true,
            task: {
                select: {
                    id: true,
                    name: true,
                },
            },
            payment: {
                select: {
                    amount: true,
                    status: true,
                    updatedAt: true,
                },
            },
        };

        if (role === Role.ADMIN) {
            select.freelancer = {
                select: {
                    user: {
                        select: {
                            names: true,
                        },
                    },
                },
            };
        }

       const [works, total] = await Promise.all([
        this.databaseService.work.findMany({
            skip,
            take,
            select,
            where,
        }),
        this.databaseService.work.count({ where }),
       ]);

       return {
        data: works,
        meta: {
            total,
            currentPage,
            limit,
            totalPages: Math.ceil(total / limit),
        },
       };
    }

    async _fetchWorkByIdBasedOnUserRole(id: string, role: Role) {
        const select: any = {
            id: true,
            startDate: true,
            endDate: true,
            completionUrl: true,
            status: true,
            task: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                },
            },
            payment: {
                select: {
                    amount: true,
                    status: true,
                    updatedAt: true,
                },
            },
        };

        if (role === Role.ADMIN) {
            select.freelancer = {
                select: {
                    id: true,
                    telephone: true,
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

        return await this.databaseService.work.findUnique({
            where: { id },
            select,
        });
    }

    async _increaseFreelancerBalance(freelancerId: string, amount: number) {
        await this.databaseService.freelancer.update({
            where: { id: freelancerId },
            data: { balance: { increment: amount } },
        });
    }

    async _updateWorkPayment(workId: string, amount: number) {
        await this.databaseService.payment.update({
            where: { workId },
            data: { amount, status: PaymentStatus.PAID, updatedAt: new Date() },
        });
    }
}   