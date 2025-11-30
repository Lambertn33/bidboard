import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/database/database.service';
import { Prisma, Role } from 'generated/prisma/client';
import { TasksHelper } from './helpers/tasks.helper';

@Injectable()
export class TasksService {
    constructor(private readonly tasksHelper: TasksHelper) {}

    async findAll(role?: Role, currentPage = 1, limit = 10, search: string = '') {
        return this.tasksHelper._fetchTasksBasedOnUserRole(role, currentPage, limit, search);
    }
}
