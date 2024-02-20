import { Module } from '@nestjs/common';
import { BillingInfoController } from './controllers/billing-info.controller';
import { BillingInfoService } from './services/billing-info.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BillingInfo, BillingInfoSchema } from './entities/billing-info.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      // { name: Company.name, schema: CompanySchema },
      // { name: Address.name, schema: AddressSchema },
      { name: BillingInfo.name, schema: BillingInfoSchema },
    ]),
  ],
  controllers: [BillingInfoController],
  providers: [BillingInfoService],
})
export class BillingInfoModule { }
