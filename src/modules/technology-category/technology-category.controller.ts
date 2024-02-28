import { Permissions } from '@common/decorators/permissions.decorator';
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateTechnologyCategoriesDto } from './dto/create-technology-category.dto';
import { UpdateTechnologyCategoryDto } from './dto/update-technology-category.dto';
import { ITechnologyCategory } from './interfaces/technology-category.interface';
import { TechnologyCategoryService } from './technology-category.service';

@Controller('technology-category')
export class TechnologyCategoryController {
  constructor(private readonly technologyCategoryService: TechnologyCategoryService) { }

  @Post("create")
  @Permissions('company.create')
  async create(@Body() createTechnologyCategoriesDto: CreateTechnologyCategoriesDto): Promise<ITechnologyCategory[]> {
    return await this.technologyCategoryService.create(createTechnologyCategoriesDto);
  }

  @Get("list")
  @Permissions('company.create')
  async findAll(): Promise<{ data?: ITechnologyCategory[], count?: number }> {
    return await this.technologyCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.technologyCategoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTechnologyCategoryDto: UpdateTechnologyCategoryDto) {
    return this.technologyCategoryService.update(+id, updateTechnologyCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.technologyCategoryService.remove(+id);
  }
}
