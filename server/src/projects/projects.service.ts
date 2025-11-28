import { DatabaseService } from '@/database/database.service';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ProjectsService {
    constructor(private readonly databaseService: DatabaseService) {}

    async findAll(currentPage = 1, limit = 10, search: string = '') {
        const skip = (currentPage - 1) * limit;
        const take = +limit;

        const where = search
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
            : undefined;

        const [projects, total] = await Promise.all([
            this.databaseService.project.findMany({
                skip,
                take,
                select: {
                    id: true,
                    name: true,
                    description: true,
                    _count: {
                        select: {
                            tasks: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
                where,
            }),
            this.databaseService.project.count({ where }),
        ]);

        return {
            data: projects,
            meta: {
                total,
                currentPage,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        }
    }

    async findOne(id: string) {
        const project = await this.databaseService.project.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                name: true,
                description: true,
                tasks: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        status: true,
                        price: true,
                    }
                },
                _count: {
                    select: {
                        tasks: true,
                    },
                },
            },
        });

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        return {
            data: project,
        }
    }

    async create(data: any) {}

    async update(id: string, data: any) {}

    async delete(id: string) {}
}
