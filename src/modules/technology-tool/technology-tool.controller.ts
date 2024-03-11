import { GetUser } from '@common/decorators/getUser.decorator';
import { Permissions } from '@common/decorators/permissions.decorator';
import { IListQuery } from '@common/interfaces/list-query.interface';
import { IUser } from '@modules/users/interfaces/user.interface';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateTechnologyToolsDto } from './dto/create-technology-tool.dto';
import { UpdateTechnologyToolDto } from './dto/update-technology-tool.dto';
import { ITechnologyToolDetails, ITechnologyTools } from './interfaces/technology-tool.interface';
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
  create(@Body() createTechnologyToolsDto: CreateTechnologyToolsDto, @GetUser() user: IUser): Promise<{ count: number, tools: ITechnologyTools[] }> {
    return this.technologyToolService.create(createTechnologyToolsDto, user);
  }

  @Get("list/category/:categoryId")
  @Permissions("company.create")
  findAll(@Param("categoryId") categoryId: string, @Query() query: IListQuery, @GetUser() user: IUser): Promise<{ data?: ITechnologyTools[], count?: number }> {
    return this.technologyToolService.findAll(categoryId, query, user);
  }

  @Get('details/:id')
  @Permissions("company.create")
  findOne(@Param('id') id: string): Promise<ITechnologyToolDetails> {
    return this.technologyToolService.findOne(id);
  }

  @Patch('edit/:id')
  @Permissions("company.create")
  update(@Param('id') id: string, @Body() updateTechnologyToolDto: UpdateTechnologyToolDto, @GetUser() user: IUser): Promise<ITechnologyTools> {
    return this.technologyToolService.update(id, updateTechnologyToolDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.technologyToolService.remove(+id);
  }
}
