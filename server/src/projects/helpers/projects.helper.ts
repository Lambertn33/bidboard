import { DatabaseService } from "@/database/database.service";
import { Injectable } from "@nestjs/common";


@Injectable()
export class ProjectsHelper {
    constructor(private readonly databaseService: DatabaseService) {}

    async _doesProjectTitleExist(title: string) {
        const project = await this.databaseService.project.findFirst({
            where: {
                name: {
                    equals: title,
                }
            },
        });
        return !!project;
    }
}