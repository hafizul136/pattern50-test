import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TechnologyToolService } from './technology-tool.service';
import { CreateTechnologyToolDto } from './dto/create-technology-tool.dto';
import { UpdateTechnologyToolDto } from './dto/update-technology-tool.dto';

@Controller('technology-tool')
export class TechnologyToolController {
  constructor(private readonly technologyToolService: TechnologyToolService) {}

  @Post()
  create(@Body() createTechnologyToolDto: CreateTechnologyToolDto) {
    return this.technologyToolService.create(createTechnologyToolDto);
  }

  @Get()
  findAll() {
    return this.technologyToolService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.technologyToolService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTechnologyToolDto: UpdateTechnologyToolDto) {
    return this.technologyToolService.update(+id, updateTechnologyToolDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.technologyToolService.remove(+id);
  }
}
