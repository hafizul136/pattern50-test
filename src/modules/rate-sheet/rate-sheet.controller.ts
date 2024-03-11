import { GetUser } from '@common/decorators/getUser.decorator';
import { Permissions } from '@common/decorators/permissions.decorator';
import { IUser } from '@modules/users/interfaces/user.interface';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateRateSheetDto } from './dto/create-rate-sheet.dto';
import { UpdateRateSheetDto } from './dto/update-rate-sheet.dto';
import { IRateSheet, IRateSheetPagination } from './interfaces/rate-sheet.interface';
import { RateSheetService } from './rate-sheet.service';

@Controller('rate-sheet')
export class RateSheetController {
  constructor(private readonly rateSheetService: RateSheetService) { }

  @Post("create")
  @Permissions('company.create')
  create(@Body() createRateSheetDto: CreateRateSheetDto, @GetUser() user: IUser) {
    return this.rateSheetService.create(createRateSheetDto, user);
  }

  @Get("list")
  @Permissions('company.view')
  async getRateSheets(@Query() query, @GetUser() user: IUser): Promise<IRateSheetPagination> {
    return await this.rateSheetService.getRateSheets(query, user);
  }

  @Get('/details/:id')
  findOne(@Param('id') id: string) {
    return this.rateSheetService.findOne(id);
  }

  @Patch(':id/status')
  @Permissions('company.create')
  update(@Param('id') id: string, @Body() updateRateSheetDto: UpdateRateSheetDto, @GetUser() user: IUser) {
    return this.rateSheetService.update(id, updateRateSheetDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rateSheetService.remove(+id);
  }
}
