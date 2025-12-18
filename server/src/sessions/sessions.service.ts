import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/database/database.service';

@Injectable()
export class SessionsService {
    constructor(private readonly databaseService: DatabaseService) {}

    async createOrRefreshSession(userId: string) {
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60);
        return this.databaseService.session.upsert({
            where: { userId },
            update: { expiresAt },
            create: { userId, expiresAt, isActive: true },
        });
    }

    async isUserLoggedIn(userId: string) {
        const session = await this.databaseService.session.findUnique({
            where: { userId },
        });
        return !!session;
    }

    async deleteSession(sessionId: string) {
        return this.databaseService.session.delete({
            where: { id: sessionId },
        });
    }
}
