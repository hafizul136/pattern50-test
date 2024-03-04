import { Permissions } from '@common/decorators/permissions.decorator';
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateTechnologyCategoriesDto } from './dto/create-technology-category.dto';
import { CreateToolTypesDto } from './dto/create-tool-types.dto';
import { UpdateTechnologyCategoryDto } from './dto/update-technology-category.dto';
import { ITechnologyCategory } from './interfaces/technology-category.interface';
import { IToolType } from './interfaces/tool-type.interface';
import { TechnologyCategoryService } from './technology-category.service';

@Controller('technology-category')
export class TechnologyCategoryController {
  constructor(private readonly technologyCategoryService: TechnologyCategoryService) { }

  @Post("create")
  @Permissions('company.create')
  async create(@Body() createTechnologyCategoriesDto: CreateTechnologyCategoriesDto): Promise<ITechnologyCategory[]> {
    return await this.technologyCategoryService.create(createTechnologyCategoriesDto);
  }

  @Post("tool-type/create")
  @Permissions('company.create')
  async createToolTypes(@Body() createToolTypesDto: CreateToolTypesDto): Promise<IToolType[]> {
    return await this.technologyCategoryService.createToolType(createToolTypesDto);
  }

  @Get("list")
  @Permissions('company.create')
  async findAll(): Promise<{ data?: ITechnologyCategory[], count?: number }> {
    return await this.technologyCategoryService.findAll();
  }

  @Get("tool-types/list")
  @Permissions('company.create')
  async findAllToolTypes(): Promise<{ data?: IToolType[], count?: number }> {
    return await this.technologyCategoryService.findAllToolTypes();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.technologyCategoryService.findOne(id);
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
