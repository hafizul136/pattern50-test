import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateRateSheetDto } from './dto/create-rate-sheet.dto';
import { UpdateRateSheetDto } from './dto/update-rate-sheet.dto';
import { RateSheetService } from './rate-sheet.service';

@Controller('rate-sheet')
export class RateSheetController {
  constructor(private readonly rateSheetService: RateSheetService) { }

  @Post("create")
  create(@Body() createRateSheetDto: CreateRateSheetDto) {
    return this.rateSheetService.create(createRateSheetDto);
  }

  @Get()
  findAll() {
    return this.rateSheetService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rateSheetService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRateSheetDto: UpdateRateSheetDto) {
    return this.rateSheetService.update(+id, updateRateSheetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rateSheetService.remove(+id);
  }
}
