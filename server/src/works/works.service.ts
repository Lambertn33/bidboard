import { Injectable, NotFoundException } from '@nestjs/common';
import { WorksHelper } from './helpers/works.helper';
import { Role, WorkStatus } from 'generated/prisma/client';

@Injectable()
export class WorksService {
    constructor(private readonly worksHelper: WorksHelper) {}

    async findAll(currentPage: number, limit: number, role: Role, workStatus?: WorkStatus) {
        const works = await this.worksHelper._fetchWorksBasedOnUserRole(currentPage, limit, role, workStatus);
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
}
