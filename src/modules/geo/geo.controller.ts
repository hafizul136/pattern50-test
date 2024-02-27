import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateGeoDto } from './dto/create-geo.dto';
import { UpdateGeoDto } from './dto/update-geo.dto';
import { GeoService } from './geo.service';

@Controller('geo')
export class GeoController {
  constructor(private readonly geoService: GeoService) { }

  @Post()
  create(@Body() createGeoDto: CreateGeoDto) {
    return this.geoService.create(createGeoDto);
  }

  @Get()
  findAll() {
    return this.geoService.findAll();
  }

  @Get("counties")
  async findAllCountries() {
    return await this.geoService.getAllCountries();
  }

  @Get('zip/:id')
  @UseGuards(AuthGuard('jwt'))
  getZip(@Param('id') id: string): Promise<any> {
    return this.geoService.zipDetails(id);
  }

  @Get("timezones")
  async findAllTimeZones() {
    return await this.geoService.getAllTimeZones();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.geoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGeoDto: UpdateGeoDto) {
    return this.geoService.update(+id, updateGeoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.geoService.remove(+id);
  }
}
