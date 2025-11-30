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

    async _checkUniqueTitleForProject(fieldName: string, fieldValue: string, id: string) {
        const project = await this.databaseService.project.findFirst({
            where: {
                [fieldName]: {
                    equals: fieldValue,
                },
                NOT: {
                    id: {
                        equals: id,
                    }
                }
            }
        });

        return !!project;
    }
}