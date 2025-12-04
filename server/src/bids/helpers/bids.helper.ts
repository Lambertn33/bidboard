import { DatabaseService } from "@/database/database.service";
import { Injectable } from "@nestjs/common";
import { Role } from "generated/prisma/client";

@Injectable()
export class BidsHelper {
    constructor(private readonly databaseService: DatabaseService) {}

    async _fetchBidsBasedOnUserRole(userId: string, role: Role, currentPage = 1, limit = 10, search: string = '') {
        const skip = (currentPage - 1) * limit;
        const take = +limit;

        // Build base where clause
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
        // If admin, no additional filter (admin sees all bids)

        // Add search filter if provided
        const searchWhere = search
            ? {
                  OR: [
                      {
                          message: {
                              contains: search,
                          },
                      },
                  ],
              }
            : {};

        // Combine where clauses
        const where = {
            ...baseWhere,
            ...searchWhere,
        };

        const include = {
            freelancer: {
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
            },
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

        const [bids, total] = await Promise.all([
            this.databaseService.bid.findMany({
                skip,
                take,
                where,
                include,
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
}