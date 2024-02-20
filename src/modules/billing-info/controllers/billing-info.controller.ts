import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateBillingInfoDto } from '../dto/create-billing-info.dto';
import { UpdateBillingInfoDTO } from '../dto/update-billing-info.dto';
import { BillingInfoService } from '../services/billing-info.service';

@Controller('billing-info')
export class BillingInfoController {
  constructor(private readonly billingInfoService: BillingInfoService) { }

  @Post()
  create(@Body() createBillingInfoDto: CreateBillingInfoDto) {
    return this.billingInfoService.create(createBillingInfoDto);
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
  update(@Param('id') id: string, @Body() updateBillingInfoDto: UpdateBillingInfoDTO) {
    return this.billingInfoService.update(+id, updateBillingInfoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.billingInfoService.remove(+id);
  }
}
