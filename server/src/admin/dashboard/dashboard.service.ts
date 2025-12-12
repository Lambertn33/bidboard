import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/database/database.service';
import { BidStatus, PaymentStatus, TaskStatus, WorkStatus } from 'generated/prisma/client';

@Injectable()
export class DashboardService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getDashboardOverview() {
    const totalProjects = await this.databaseService.project.count();
    const totalActiveTasks = await this.databaseService.task.count({ where: { status: TaskStatus.OPEN } });
    const totalAssignedTasks = await this.databaseService.task.count({ where: { status: TaskStatus.ASSIGNED } });
    const totalCompletedTasks = await this.databaseService.task.count({ where: { status: TaskStatus.COMPLETED } });
    const totalPendingBids = await this.databaseService.bid.count({ where: { status: BidStatus.PENDING } });
    const totalCompletedWorks = await this.databaseService.work.count({ where: { status: WorkStatus.COMPLETED } });  
    const totalPaidResult = await this.databaseService.payment.findMany({
      where: {
        status: PaymentStatus.PAID,
      },
    });
    const totalPaid = totalPaidResult.reduce((acc, curr) => acc + curr.amount, 0);
    const totalActiveFreelancers = await this.databaseService.freelancer.count();

    return {
      totalProjects,
      totalActiveTasks,
      totalAssignedTasks,
      totalCompletedTasks,
      totalPendingBids,
      totalCompletedWorks,
      totalPaid,
      totalActiveFreelancers,
    };
  }

  async getRecentTasks() {
    const recentTasks = await this.databaseService.task.findMany({
        select: {
            id: true,
            name: true,
            description: true,
            status: true,
            price: true,
            project: {
                select: {
                    id: true,
                    name: true,
                },
            },
            _count: {
                select: {
                    bids: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: 10
    });

    return recentTasks;
  }

  async getRecentBids() {
    const recentBids = await this.databaseService.bid.findMany({
      select: {
        id: true,
        message: true,
        status: true,
        task: {
          select: {
            id: true,
            name: true,
          },
        },
        freelancer: {
          select: {
            id: true,
            telephone: true,
            user: {
              select: {
                id: true,
                names: true,
              },
            },
          },
        },
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    return recentBids;
  } 

  async getRecentWorks() {
    const recentWorks = await this.databaseService.work.findMany({
      select: {
        id: true,
        startDate: true,
        status: true,
        endDate: true,
        completionUrl: true,
        task: {
          select: {
            id: true,
            name: true,
          },
        },
        freelancer: {
          select: {
            id: true,
            telephone: true,
            user: {
              select: {
                id: true,
                names: true,
              },
            },
          },
        },
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    return recentWorks;
  }
}
