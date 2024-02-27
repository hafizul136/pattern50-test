import { ExceptionHelper } from '@common/helpers/ExceptionHelper';
import { NestHelper } from '@common/helpers/NestHelper';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model } from 'mongoose';
import states from 'states-us/dist';
import timezones from 'timezones-list';
import { CreateGeoDto } from './dto/create-geo.dto';
import { UpdateGeoDto } from './dto/update-geo.dto';
import { Country, CountryDocument } from './entities/geo.entity';
const zipcodes = require('zipcodes');
@Injectable()
export class GeoService {
  constructor(
    @InjectModel(Country.name)
    private countryModelModel: Model<CountryDocument>,
  ) { }
  create(createGeoDto: CreateGeoDto) {
    return 'This action adds a new geo';
  }

  async getAllCountries() {
    return await this.countryModelModel.find();
  }
  async zipDetails(zip: string): Promise<any> {
    let zipCode: string = zip;
    const isExists = zip.indexOf('-');
    if (isExists != -1) {
      const divStr = zip.split('-');
      zipCode = divStr[0];
    }

    const data: any = zipcodes.lookup(zipCode);
    if (!NestHelper.getInstance().isEmpty(data)) {
      const state = this.getStateNameByAbbreviation(data);
      if (!NestHelper.getInstance().isEmpty(state)) {
        data.state = state[0].name;
      }

      return data;
    } else {
      ExceptionHelper.getInstance().noDataFound();
    }
  }

  async zipDetailsWithAddress(zip: string): Promise<any> {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&key=${process.env.Google_Map_Key}`;
    console.log(url);
    const address = await axios.get(url)
      .then(res => res?.data)
      .catch(error => {
        ExceptionHelper.getInstance().defaultError(
          error?.message,
          error?.code,
          HttpStatus.FORBIDDEN
        )
      });
    return address;
  }

  getStateNameByAbbreviation(
    data: any
  ): { name: string; abbreviation: string; territory: boolean; contiguous: boolean }[] {
    return states.filter(function (e) {
      return e.abbreviation == data.state;
    });
  }

  async getAllTimeZones() {
    return timezones;
  }

  findAll() {
    return `This action returns all geo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} geo`;
  }

  update(id: number, updateGeoDto: UpdateGeoDto) {
    return `This action updates a #${id} geo`;
  }

  remove(id: number) {
    return `This action removes a #${id} geo`;
  }
}
