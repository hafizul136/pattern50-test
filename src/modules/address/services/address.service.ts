import { NestHelper } from '@common/helpers/NestHelper';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { ExceptionHelper } from '../../../common/helpers/ExceptionHelper';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';
import { Address, AddressDocument } from '../entities/address.entity';
import { IAddress } from '../interfaces/address.interface';

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(Address.name)
    private addressModel: Model<AddressDocument>) { }

  async create(createAddressDto: CreateAddressDto, session?: any): Promise<IAddress> {
    try {
      const addresses = await this.addressModel.create([createAddressDto], { session });
      const address =NestHelper.getInstance().arrayFirstOrNull(addresses)
      return address
    } catch (error) {
      ExceptionHelper.getInstance().defaultError(
        error?.message,
        error?.code,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async findAll(): Promise<IAddress[]> {
    return await this.addressModel.find().lean().exec();
  }

  async findOne(id: mongoose.Types.ObjectId): Promise<IAddress> {
    const Address = await this.addressModel.findOne({ _id: id }).lean().exec();
    if (NestHelper.getInstance().isEmpty(Address)) {
      ExceptionHelper.getInstance().defaultError(
        "Data not found", "data_not_found", HttpStatus.BAD_REQUEST
      )
    }
    return Address
  }

  async update(id: Types.ObjectId, updateAddressDto: UpdateAddressDto): Promise<IAddress> {
    const company = await this.addressModel.findOne({ _id: id }).lean().exec();
    if (!company) ExceptionHelper.getInstance().noDataFound()
    return await this.addressModel.findByIdAndUpdate(id, updateAddressDto, { new: true }).lean();
  }

  async remove(id: string): Promise<IAddress> {
    return await this.addressModel.findByIdAndRemove(id).exec();
  }
}
