import { DatabaseService } from '@/database/database.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProjectsService {
    constructor(private readonly databaseService: DatabaseService) {}

    async findAll(currentPage = 1, limit = 10, search: string = '') {
        const skip = (currentPage - 1) * limit;
        const take = +limit;

        const projects = await this.databaseService.project.findMany({
            skip,
            take,
            orderBy: {
                createdAt: 'desc',
            },
            where: search
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
                : undefined,
        });

        return {
            data: projects,
            meta: {
                total: projects.length,
                currentPage,
                limit,
            },
        }
    }

    async findOne(id: string) {}

    async create(data: any) {}

    async update(id: string, data: any) {}

    async delete(id: string) {}
}
