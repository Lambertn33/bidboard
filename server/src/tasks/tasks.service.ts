import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '@/database/database.service';
import { Prisma, Role } from 'generated/prisma/client';
import { TasksHelper } from './helpers/tasks.helper';
import { CreateTaskDto } from './dto/create.dto';

@Injectable()
export class TasksService {
    constructor(private readonly tasksHelper: TasksHelper, private readonly databaseService: DatabaseService) {}

    async findAll(role?: Role, currentPage = 1, limit = 10, search: string = '') {
        return this.tasksHelper._fetchTasksBasedOnUserRole(role, currentPage, limit, search);
    }

    async findOne(id: string, role?: Role){
        const task = await this.tasksHelper._fetchTaskByIdBasedOnUserRole(id, role);
        if (!task) {
            throw new NotFoundException('Task not found');
        }
        return {
            data: task,
        };
    }

    async create(data: CreateTaskDto) {
        const projectExists = await this.tasksHelper._doesProjectExist(data.project_id);
        if (!projectExists) {
            throw new NotFoundException(`Project with ID ${data.project_id} not found`);
        }

        const newTask = await this.databaseService.task.create({
            data: {
                name: data.name,
                description: data.description,
                project: {
                    connect: { id: data.project_id },
                },
                price: data.price,
                skills: data.skills,
            },
        });
        return {
            message: 'Task created successfully',
            data: newTask,
        };
    }
}
