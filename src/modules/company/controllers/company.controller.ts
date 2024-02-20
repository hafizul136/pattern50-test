import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import mongoose from 'mongoose';
import { CreateCompanyDTO } from '../dto/create-company.dto';
import { UpdateCompanyDTO } from '../dto/update-company.dto';
import { ICompany } from '../interfaces/company.interface';
import { CompanyService } from '../services/company.service';
import { Permissions } from '@common/decorators/permissions.decorator';
import { GetUser } from '@common/decorators/getUser.decorator';
import { IUser } from '@modules/users/interfaces/user.interface';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) { }

  @Post()
  @Permissions('company.create')
  async create(@Body() createCompanyDto: CreateCompanyDTO,@GetUser() user:IUser): Promise<ICompany> {
    return await this.companyService.create(createCompanyDto, user);
  }

  @Get(':id')
  async findOne(@Param('id') id: mongoose.Types.ObjectId): Promise<ICompany> {
    return await this.companyService.findOne(id);
  }


  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDTO): Promise<ICompany> {
    return await this.companyService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ICompany> {
    return await this.companyService.remove(id);
  }
}
