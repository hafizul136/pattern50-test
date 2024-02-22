import { EINSecureHelper } from '@common/helpers/EinHelper';
import { ExceptionHelper } from '@common/helpers/ExceptionHelper';
import { NestHelper } from '@common/helpers/NestHelper';
import { ConstructObjectFromDtoHelper } from '@helpers/constructObjectFromDTO';
import { AddressService } from '@modules/address/services/address.service';
import { BillingInfoService } from '@modules/billing-info/services/billing-info.service';
import { DatabaseService } from '@modules/db/database.service';
import { IUser } from '@modules/users/interfaces/user.interface';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { appConfig } from 'configuration/app.config';
import mongoose, { Model, isValidObjectId } from 'mongoose';
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
    private databaseService: DatabaseService,
    // @InjectConnection() private readonly connection: Connection
  ) { }

  async create(createCompanyDTO: CreateCompanyDTO, user: IUser): Promise<ICompany[]> {
    try {
      // const conn = this.connection;
      // const session = await conn.startSession();
      console.time('create company')
      const session = await this.databaseService.startSession();
      let company: ICompany[];
      await session.withTransaction(async () => {

        const addressDTO = await ConstructObjectFromDtoHelper.ConstructCreateAddressObject(createCompanyDTO, user)
        const address = await this.addressService.create(addressDTO, session)

        const billingDTO = await ConstructObjectFromDtoHelper.ConstructCreateBillingInfoObject(createCompanyDTO, user)
        const billingInfo = await this.billingService.create(billingDTO, session)
        // ein uniqueness check
        await this.einDuplicateCheck(createCompanyDTO?.ein);
        //email and masterEmail unique check
        await this.duplicateEmailCheck(createCompanyDTO?.email, createCompanyDTO?.masterEmail);
        const companyCreateDTO = await ConstructObjectFromDtoHelper.ConstructCreateCompanyObject(user, createCompanyDTO, address[0], billingInfo[0])

        company = await this.companyModel.create([companyCreateDTO], { session });

      });

      session.endSession();
      console.timeEnd('create company')
      return company;

    } catch (error) {
      ExceptionHelper.getInstance().defaultError(
        error?.message,
        error?.code,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  private async einDuplicateCheck(ein: string) {
    const hashedEIN = await EINSecureHelper.encrypt(ein, appConfig.einHashedSecret);
    const companyExistByEIN = await this.companyModel.findOne({ ein: hashedEIN }).lean();
    if (!NestHelper.getInstance()?.isEmpty(companyExistByEIN)) {
      ExceptionHelper.getInstance().defaultError(
        'EIN must be unique',
        'EIN_must_be_unique',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  private async duplicateEmailCheck(email: string, masterEmail: string) {
    const isCompanyExistByEmail = await this.findOneByEmail(email);
    const isCompanyExistByMasterEmail = await this.findOneByEmail(masterEmail);
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
