import { NestHelper } from '@common/helpers/NestHelper';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ExceptionHelper } from '../../common/helpers/ExceptionHelper';
import { CreateCompanyAddressDto } from './dto/create-company-address.dto';
import { UpdateCompanyAddressDto } from './dto/update-company-address.dto';
import { CompanyAddress, CompanyAddressDocument } from './entities/company-address.entity';
import { IAddress } from './interfaces/company-address.interface';

@Injectable()
export class CompanyAddressService {
  constructor(
    @InjectModel(CompanyAddress.name)
    private companyAddressModel: Model<CompanyAddressDocument>) { }

  async create(createCompanyAddressDto: CreateCompanyAddressDto): Promise<IAddress> {
    try {
      return (await this.companyAddressModel.create(createCompanyAddressDto)).toObject();
    } catch (error) {
      ExceptionHelper.getInstance().defaultError(
        error?.message,
        error?.code,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async findAll(): Promise<IAddress[]> {
    return await this.companyAddressModel.find().lean().exec();
  }

  async findOne(id: mongoose.Types.ObjectId): Promise<IAddress> {
    const companyAddress = await this.companyAddressModel.findOne({ _id: id }).lean().exec();
    if (NestHelper.getInstance().isEmpty(companyAddress)) {
      ExceptionHelper.getInstance().defaultError(
        "Data not found", "data_not_found", HttpStatus.BAD_REQUEST
      )
    }
    return companyAddress
  }

  async update(id: mongoose.Types.ObjectId, updateCompanyAddressDto: UpdateCompanyAddressDto): Promise<IAddress> {
    const company = await this.companyAddressModel.findOne({ _id: id }).lean().exec();
    if (!company) ExceptionHelper.getInstance().noDataFound()
    return await this.companyAddressModel.findByIdAndUpdate(id, updateCompanyAddressDto, { new: true }).lean();
  }

  async remove(id: string): Promise<IAddress> {
    return await this.companyAddressModel.findByIdAndRemove(id).exec();
  }
}
