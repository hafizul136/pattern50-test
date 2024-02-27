
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AddressController } from './controllers/address.controller';
import { AddressService } from './services/address.service';
import { Address, AddressSchema } from './entities/address.entity';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Address.name, schema: AddressSchema }
    ])
  ],
  controllers: [AddressController],
  providers: [AddressService]
})
export class AddressModule { }
