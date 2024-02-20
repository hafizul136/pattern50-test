import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import mongoose from 'mongoose';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';
import { IAddress } from '../interfaces/address.interface';
import { AddressService } from '../services/address.service';

@Controller('address')
export class AddressController {
  constructor(private readonly companyAddressService: AddressService) { }

  @Post()
  // @Permissions('companyAddress.create')
  async create(@Body() createCompanyAddressDto: CreateAddressDto): Promise<IAddress> {
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
  update(@Param('id') id: mongoose.Types.ObjectId, @Body() updateCompanyAddressDto: UpdateAddressDto): Promise<IAddress> {
    return this.companyAddressService.update(id, updateCompanyAddressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<IAddress> {
    return this.companyAddressService.remove(id);
  }
}
