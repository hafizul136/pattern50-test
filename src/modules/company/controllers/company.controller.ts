import { GetUser } from '@common/decorators/getUser.decorator';
import { Permissions } from '@common/decorators/permissions.decorator';
import { IUser } from '@modules/users/interfaces/user.interface';
import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateCompanyDTO } from '../dto/create-company.dto';
import { UpdateCompanyDTO } from '../dto/update-company.dto';
import { ICompany } from '../interfaces/company.interface';
import { CompanyService } from '../services/company.service';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) { }

  @Post()
  @Permissions('company.create')
  async create(@Body() createCompanyDto: CreateCompanyDTO, @GetUser() user: IUser): Promise<ICompany> {
    return await this.companyService.create(createCompanyDto, user);
  }

  @Get("list")
  @Permissions('company.view')
  async getCompanies(@Query() query, @GetUser() user: IUser): Promise<{ data?: ICompany[], total?: number }> {
    return await this.companyService.findAll(query, user);
  }

  @Get(':id')
  @Permissions('company.view')
  async findOne(@Param('id') id: string): Promise<ICompany> {
    return await this.companyService.findOne(id);
  }

  @Put(':id')
  @Permissions('company.create')
  async update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDTO, @GetUser() user: IUser): Promise<ICompany> {
    return await this.companyService.update(id, updateCompanyDto, user);
  }

  // @Delete(':id')
  // async remove(@Param('id') id: string): Promise<ICompany> {
  //   return await this.companyService.remove(id);
  // }

}
