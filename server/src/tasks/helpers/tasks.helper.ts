import { DatabaseService } from "@/database/database.service";
import { Injectable } from "@nestjs/common";
import { Role, TaskStatus } from "generated/prisma/client";

@Injectable()
export class TasksHelper {
    constructor(private readonly databaseService: DatabaseService) {}
    
    async _fetchTasksBasedOnUserRole(role?: Role, currentPage = 1, limit = 10, search: string = '') {
        const skip = (currentPage - 1) * limit;
        const take = +limit;

        // Base where clause based on role
        const baseWhere = role === Role.ADMIN 
            ? {} // Admin sees all tasks
            : { status: TaskStatus.OPEN }; // Freelancer or no user sees only OPEN tasks

        // Add search filter if provided
        const searchWhere = search
            ? {
                  OR: [
                      {
                          name: {
                              contains: search,
                          },
                      },
                      {
                          description: {
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

        const include: any = {
            project: {
                select: {
                    id: true,
                    name: true,
                },
            },
        };

        // Include freelancer info for admin users
        if (role === Role.ADMIN) {
            include.freelancer = {
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

        const [tasks, total] = await Promise.all([
            this.databaseService.task.findMany({
                where,
                include,
                skip,
                take,
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            this.databaseService.task.count({ where }),
        ]);

        return {
            data: tasks,
            meta: {
                total,
                currentPage,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
}
    