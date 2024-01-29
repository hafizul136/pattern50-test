import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import mongoose from 'mongoose';
import { CompanyAddressService } from './company-address.service';
import { CreateCompanyAddressDto } from './dto/create-company-address.dto';
import { UpdateCompanyAddressDto } from './dto/update-company-address.dto';
import { IAddress } from './interfaces/company-address.interface';

@Controller('company-address')
export class CompanyAddressController {
  constructor(private readonly companyAddressService: CompanyAddressService) { }

  @Post()
  // @Permissions('companyAddress.create')
  async create(@Body() createCompanyAddressDto: CreateCompanyAddressDto): Promise<IAddress> {
    return await this.companyAddressService.create(createCompanyAddressDto);
  }

  @Get()
  async findAll(): Promise<IAddress[]> {
    return this.companyAddressService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: mongoose.Types.ObjectId): Promise<IAddress> {
    return this.companyAddressService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: mongoose.Types.ObjectId, @Body() updateCompanyAddressDto: UpdateCompanyAddressDto): Promise<IAddress> {
    return this.companyAddressService.update(id, updateCompanyAddressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<IAddress> {
    return this.companyAddressService.remove(id);
  }
}
