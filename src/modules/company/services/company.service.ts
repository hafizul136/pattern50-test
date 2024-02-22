import { ExceptionHelper } from '@common/helpers/ExceptionHelper';
import { NestHelper } from '@common/helpers/NestHelper';
import { ConstructObjectFromDtoHelper } from '@helpers/constructObjectFromDTO';
import { AddressService } from '@modules/address/services/address.service';
import { BillingInfoService } from '@modules/billing-info/services/billing-info.service';
import { IUser } from '@modules/users/interfaces/user.interface';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Connection, Model, isValidObjectId } from 'mongoose';
import { CreateCompanyDTO } from '../dto/create-company.dto';
import { UpdateCompanyDTO } from '../dto/update-company.dto';
import { Company, CompanyDocument } from '../entities/company.entity';
import { ICompany } from '../interfaces/company.interface';
@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name)
    private companyModel: Model<CompanyDocument>,
    private addressService: AddressService,
    private billingService: BillingInfoService,
    @InjectConnection() private readonly connection: Connection
  ) { }

  async create(createCompanyDTO: CreateCompanyDTO, user: IUser): Promise<ICompany[]> {
    try {

      //with transaction
      const conn = this.connection;
      const session = await conn.startSession();
      let company:ICompany[];
      await session.withTransaction(async () => {

        const addressDTO = await ConstructObjectFromDtoHelper.ConstructCreateAddressObject(createCompanyDTO, user)
        const address = await this.addressService.create(addressDTO, session)

        const billingDTO = await ConstructObjectFromDtoHelper.ConstructCreateBillingInfoObject(createCompanyDTO, user)
        const billingInfo = await this.billingService.create(billingDTO,session)

        const companyCreateDTO = await ConstructObjectFromDtoHelper.ConstructCreateCompanyObject(user, createCompanyDTO, address[0], billingInfo[0])

        console.log({ companyCreateDTO })
        //email and masterEmail unique check
        await this.duplicateEmailCheck(companyCreateDTO);

        company = await this.companyModel.create([companyCreateDTO],{session});
        
      });

      session.endSession();
      return company;
      //with transaction


      // const addressDTO = await ConstructObjectFromDtoHelper.ConstructCreateAddressObject(createCompanyDTO,user)
      // const address = await this.addressService.create(addressDTO)

      // const billingDTO = await ConstructObjectFromDtoHelper.ConstructCreateBillingInfoObject(createCompanyDTO, user)
      // const billingInfo = await this.billingService.create(billingDTO)

      // const companyCreateDTO = await ConstructObjectFromDtoHelper.ConstructCreateCompanyObject(user, createCompanyDTO, address, billingInfo)

      // console.log({ companyCreateDTO })
      // //email and masterEmail unique check
      // await this.duplicateEmailCheck(companyCreateDTO);

      // return await (await this.companyModel.create(companyCreateDTO)).toObject();
    } catch (error) {
      ExceptionHelper.getInstance().defaultError(
        error?.message,
        error?.code,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  private async duplicateEmailCheck(companyCreateDTO: { name: string; email: string; masterEmail: string; phone: string; ein: string; userId: mongoose.Types.ObjectId; addressId: any; billingInfoId: any; clientId: mongoose.Types.ObjectId; }) {
    const isCompanyExistByEmail = await this.findOneByEmail(companyCreateDTO?.email);
    const isCompanyExistByMasterEmail = await this.findOneByEmail(companyCreateDTO?.masterEmail);
    if (!NestHelper.getInstance().isEmpty(isCompanyExistByEmail) || !NestHelper.getInstance().isEmpty(isCompanyExistByMasterEmail)) {
      ExceptionHelper.getInstance().defaultError(
        'Duplicate email or master email',
        'duplicate_email_or_master_email',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async findOneByEmail(email: string): Promise<ICompany> {
    return await this.companyModel.find({ email }).lean();
  }
  async findOneByMasterEmail(email: string): Promise<ICompany> {
    return await this.companyModel.find({ masterEmail: email }).lean();
  }
  async findAll(): Promise<ICompany> {
    return await this.companyModel.find().lean();
  }

  async findOne(id: mongoose.Types.ObjectId): Promise<ICompany> {
    if (NestHelper.getInstance().isEmpty(id) && !isValidObjectId(id)) {
      ExceptionHelper.getInstance().defaultError(
        'invalid Company id',
        'invalid_Company_id',
        HttpStatus.BAD_REQUEST
      );
    }
    const Company = await this.companyModel.findOne({ _id: id }).exec();
    console.log({ "Company": Company })
    return Company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDTO): Promise<ICompany> {
    return await this.companyModel.findByIdAndUpdate(id, updateCompanyDto, { new: true }).lean();
  }

  async remove(id: string): Promise<ICompany> {
    return await this.companyModel.findByIdAndRemove(id).lean();
  }
}
