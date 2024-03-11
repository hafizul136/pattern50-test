import { Permissions } from '@common/decorators/permissions.decorator';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateRateSheetDto } from './dto/create-rate-sheet.dto';
import { UpdateRateSheetDto } from './dto/update-rate-sheet.dto';
import { RateSheetService } from './rate-sheet.service';
import { GetUser } from '@common/decorators/getUser.decorator';
import { IEmployee } from '@modules/employee/interfaces/employee.interface';
import { IUser } from '@modules/users/interfaces/user.interface';
import { IRateSheet } from './interfaces/ratesheet.interface';

@Controller('rate-sheet')
export class RateSheetController {
  constructor(private readonly rateSheetService: RateSheetService) { }

  @Post("create")
  @Permissions('company.create')
  create(@Body() createRateSheetDto: CreateRateSheetDto) {
    return this.rateSheetService.create(createRateSheetDto);
  }

  @Get("list")
  @Permissions('company.view')
  async getRateSheets(@Query() query, @GetUser() user: IUser): Promise<{ data?: IRateSheet[], total?: number }> {
    return await this.rateSheetService.getRateSheets(query, user);
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
