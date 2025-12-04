import { Injectable } from '@nestjs/common';
import { WorksHelper } from './helpers/works.helper';
import { Role, WorkStatus } from 'generated/prisma/client';

@Injectable()
export class WorksService {
    constructor(private readonly worksHelper: WorksHelper) {}

    async findAll(currentPage: number, limit: number, role: Role, workStatus?: WorkStatus) {
        return await this.worksHelper._fetchWorksBasedOnUserRole(currentPage, limit, role, workStatus);
    }
}
