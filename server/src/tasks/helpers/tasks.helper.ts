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

        const select: any = {
            id: true,
            name: true,
            description: true,
            status: true,
            price: true,
            skills: true,
            project: {
                select: {
                    id: true,
                    name: true,
                },
            },
        };

        const [tasks, total] = await Promise.all([
            this.databaseService.task.findMany({
                where,
                select,
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

    async _fetchTaskByIdBasedOnUserRole(id: string, role?: Role) {
        // Non-admin users can only see OPEN tasks
        const where: any = {
            id,
        };

        if (role !== Role.ADMIN) {
            where.status = TaskStatus.OPEN;
        }

        const select: any = {
            id: true,
            name: true,
            description: true,
            status: true,
            price: true,
            skills: true,
            createdAt: true,
            updatedAt: true,
            project: {
                select: {
                    id: true,
                    name: true,
                },
            },
        };

        // For admin, include work with freelancer details
        if (role === Role.ADMIN) {
            select.work = {
                select: {
                    id: true,
                    completionUrl: true,
                    status: true,
                    startDate: true,
                    endDate: true,
                    freelancer: {
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
                    },
                },
            };
            select.bids = {
                select: {
                    id: true,
                    message: true,
                    status: true,
                    freelancer: {
                        select: {
                            id: true,
                            user: {
                                select: {
                                    id: true,
                                    names: true,
                                    email: true,
                                },
                            },
                        },
                    },
                },
            };
        }

        const task = await this.databaseService.task.findFirst({
            where,
            select,
        });
        return task;
    }

    async _doesProjectExist(projectId: string): Promise<boolean> {
        const project = await this.databaseService.project.findUnique({
            where: { id: projectId },
            select: { id: true },
        });
        return !!project;
    }
}
    