import { Permissions } from '@common/decorators/permissions.decorator';
import { IListQuery } from '@common/interfaces/list-query.interface';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateTechnologyToolsDto } from './dto/create-technology-tool.dto';
import { UpdateTechnologyToolDto } from './dto/update-technology-tool.dto';
import { TechnologyToolService } from './technology-tool.service';

@Controller('technology-tool')
export class TechnologyToolController {
  constructor(private readonly technologyToolService: TechnologyToolService) { }

  @Patch('/upload-logo')
  @UseInterceptors(FileInterceptor('logo'))
  async uploadFile(@UploadedFile() logo: Express.Multer.File): Promise<any> {
    return await this.technologyToolService.uploadLogo(logo);
  }

  @Post("create")
  @Permissions("company.create")
  create(@Body() createTechnologyToolsDto: CreateTechnologyToolsDto) {
    return this.technologyToolService.create(createTechnologyToolsDto);
  }

  @Get("list/category/:categoryId")
  @Permissions("company.create")
  findAll(@Param("categoryId") categoryId: string, @Query() query: IListQuery) {
    return this.technologyToolService.findAll(categoryId, query);
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
