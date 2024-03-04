import { Permissions } from '@common/decorators/permissions.decorator';
import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
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

  @Get()
  @Permissions("company.create")
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
