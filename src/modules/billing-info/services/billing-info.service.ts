import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateBillingInfoDto } from '../dto/create-billing-info.dto';
import { UpdateBillingInfoDTO } from '../dto/update-billing-info.dto';
import { IBillingInfo } from '../interfaces/billing.interface';
import { InjectModel } from '@nestjs/mongoose';
import { BillingInfo, BillingInfoDocument } from '../entities/billing-info.entity';
import { Model } from 'mongoose';
import { ExceptionHelper } from '@common/helpers/ExceptionHelper';

@Injectable()
export class BillingInfoService {
  constructor(@InjectModel(BillingInfo.name)
  private billingInfoModel: Model<BillingInfoDocument>,){

  }
  async create(createBillingInfoDto: CreateBillingInfoDto, session?:any):Promise<IBillingInfo[]> {
    try {
      return await this.billingInfoModel.create([createBillingInfoDto], { session });
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

  update(id: number, updateBillingInfoDto: UpdateBillingInfoDTO) {
    return `This action updates a #${id} billingInfo`;
  }

  remove(id: number) {
    return `This action removes a #${id} billingInfo`;
  }
}
