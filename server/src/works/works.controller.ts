import { Controller, Query } from '@nestjs/common';
import { WorksService } from './works.service';

@Controller('works')
export class WorksController {
  constructor(private readonly worksService: WorksService) {}

  async findAll(
    @Query('currentPage') currentPage: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search: string = '',
  ) {
   
  }
}
