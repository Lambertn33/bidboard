import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { WorksHelper } from './helpers/works.helper';
import { Role, TaskStatus, WorkStatus } from 'generated/prisma/client';
import { DatabaseService } from '@/database/database.service';

@Injectable()
export class WorksService {
    constructor(private readonly worksHelper: WorksHelper, private readonly databaseService: DatabaseService) {}

    async findAll(currentPage: number, limit: number, role: Role, userId: string, workStatus?: WorkStatus) {
        const works = await this.worksHelper._fetchWorksBasedOnUserRole(currentPage, limit, role, userId, workStatus);
        return {
            data: works.data,
            meta: works.meta,
        };
    }

    async findOne(id: string, role: Role) {
        const work = await this.worksHelper._fetchWorkByIdBasedOnUserRole(id, role);
        if (!work) {
            throw new NotFoundException('Work not found');
        }
        return {
            data: work,
        };
    }

    async completeWork(id: string, completionUrl: string) {
        const work = await this.databaseService.work.findUnique({
            where: { id },
            select: { id: true, taskId: true, freelancerId: true },
        });

        if (!work) {
            throw new NotFoundException('Work not found');
        }

        await this.databaseService.work.update({
            where: { id },
            data: { completionUrl, status: WorkStatus.COMPLETED },
        });
        await this.databaseService.task.update({
            where: { id: work.taskId },
            data: { status: TaskStatus.COMPLETED },
        });

        return {
            message: 'Work completed successfully',
            data: work,
        };
        
    }

    async payWork(id: string) {
        const work = await this.databaseService.work.findUnique({
            where: { id },
            select: { 
                id: true, 
                taskId: true,
                freelancerId: true,
                task: { select: { price: true } },
            },
        });

        if (!work) {
            throw new NotFoundException('Work not found');
        }

        await this.worksHelper._increaseFreelancerBalance(work.freelancerId, work.task.price);

        await this.databaseService.work.update({
            where: { id },
            data: { status: WorkStatus.COMPLETED },
        });

        return {
            message: 'Work paid successfully',
            data: work,
        };
    }
}
