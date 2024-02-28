import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateTechnologyCategoriesDto } from './dto/create-technology-category.dto';
import { UpdateTechnologyCategoryDto } from './dto/update-technology-category.dto';
import { TechnologyCategoryService } from './technology-category.service';

@Controller('technology-category')
export class TechnologyCategoryController {
  constructor(private readonly technologyCategoryService: TechnologyCategoryService) { }

  @Post("create")
  create(@Body() createTechnologyCategoriesDto: CreateTechnologyCategoriesDto) {
    return this.technologyCategoryService.create(createTechnologyCategoriesDto);
  }

  @Get("list")
  findAll() {
    return this.technologyCategoryService.findAll();
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
