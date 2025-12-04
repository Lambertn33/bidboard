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

        if (role === Role.ADMIN) {
            select.freelancer = {
                select: {
                    id: true,
                    telephone: true,
                },
            };
        }

        return await this.databaseService.work.findMany({
            skip,
            take,
            select,
            where,
        });
    }

    async _fetchWorkByIdBasedOnUserRole(id: string, role: Role) {
        const work = await this.databaseService.work.findUnique({
            where: { id },
            select: { id: true, taskId: true, freelancerId: true },
        });
        return work;
    }
}   