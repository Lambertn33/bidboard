import { Role, WorkStatus } from "generated/prisma/client";
import { DatabaseService } from "@/database/database.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class WorksHelper {
    constructor(private readonly databaseService: DatabaseService) {}

    async _fetchWorksBasedOnUserRole(currentPage = 1, limit = 10, role: Role, workStatus?: WorkStatus) {
        const skip = (currentPage - 1) * limit;
        const take = +limit;

        const where: any = {};

        if (workStatus) {
            where.status = workStatus;
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
                    description: true,
                },
            },
        };

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
}   