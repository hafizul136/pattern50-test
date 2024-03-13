import { ExceptionHelper } from '@common/helpers/ExceptionHelper';
import { NestHelper } from '@common/helpers/NestHelper';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { CreateBillingInfoDto } from '../dto/create-billing-info.dto';
import { UpdateBillingInfoDTO } from '../dto/update-billing-info.dto';
import { BillingInfo, BillingInfoDocument } from '../entities/billing-info.entity';
import { IBillingInfo } from '../interfaces/billing.interface';

@Injectable()
export class BillingInfoService {
  constructor(@InjectModel(BillingInfo.name)
  private billingInfoModel: Model<BillingInfoDocument>,) {

  }
  async create(createBillingInfoDto: CreateBillingInfoDto, session?: any): Promise<IBillingInfo> {
    try {
      const billingInfos = await this.billingInfoModel.create([createBillingInfoDto], { session });
      const billingInfo = NestHelper.getInstance().arrayFirstOrNull(billingInfos)
      return billingInfo
    } catch (error) {
      ExceptionHelper.getInstance().defaultError(
        error?.message,
        error?.code,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  findAll() {
    return `This action returns all billingInfo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} billingInfo`;
  }

  async update(id: Types.ObjectId | mongoose.Schema.Types.ObjectId, updateBillingInfoDto: UpdateBillingInfoDTO): Promise<IBillingInfo> {
    return await this.billingInfoModel.findOneAndUpdate(id, updateBillingInfoDto).lean()
  }

  remove(id: number) {
    return `This action removes a #${id} billingInfo`;
  }
}
