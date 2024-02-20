import { Injectable } from '@nestjs/common';
import { CreateBillingInfoDto } from '../dto/create-billing-info.dto';
import { UpdateBillingInfoDTO } from '../dto/update-billing-info.dto';
import { IBillingInfo } from '../interfaces/billing.interface';
import { InjectModel } from '@nestjs/mongoose';
import { BillingInfo, BillingInfoDocument } from '../entities/billing-info.entity';
import { Model } from 'mongoose';

@Injectable()
export class BillingInfoService {
  constructor(@InjectModel(BillingInfo.name)
  private companyModel: Model<BillingInfoDocument>,){

  }
  async create(createBillingInfoDto: CreateBillingInfoDto):Promise<IBillingInfo> {
    return await (await this.companyModel.create(createBillingInfoDto)).toObject();
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
