import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Types } from 'mongoose';
import { CreateBillingInfoDto } from '../dto/create-billing-info.dto';
import { UpdateBillingInfoDTO } from '../dto/update-billing-info.dto';
import { IBillingInfo } from '../interfaces/billing.interface';
import { BillingInfoService } from '../services/billing-info.service';

@Controller('billing-info')
export class BillingInfoController {
  constructor(private readonly billingInfoService: BillingInfoService) { }

  @Post()
  async create(@Body() createBillingInfoDto: CreateBillingInfoDto): Promise<IBillingInfo> {
    return await this.billingInfoService.create(createBillingInfoDto);
  }

  @Get()
  findAll() {
    return this.billingInfoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.billingInfoService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: Types.ObjectId, @Body() updateBillingInfoDto: UpdateBillingInfoDTO): Promise<IBillingInfo> {
    return await this.billingInfoService.update(id, updateBillingInfoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.billingInfoService.remove(+id);
  }
}
