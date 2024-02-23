import { EINSecureHelper } from '@common/helpers/EinHelper';
import { ExceptionHelper } from '@common/helpers/ExceptionHelper';
import { NestHelper } from '@common/helpers/NestHelper';
import { AggregationHelper } from '@common/helpers/aggregation.helper';
import { ConstructObjectFromDtoHelper } from '@common/helpers/constructObjectFromDTO';
import { DateHelper } from '@common/helpers/date.helper';
import { MongooseHelper } from '@common/helpers/mongooseHelper';
import { ZipCodeValidator } from '@common/helpers/zipCodeValidator';
import { AddressService } from '@modules/address/services/address.service';
import { BillingInfoService } from '@modules/billing-info/services/billing-info.service';
import { DatabaseService } from '@modules/db/database.service';
import { IUser } from '@modules/users/interfaces/user.interface';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { appConfig } from 'configuration/app.config';
import { Model, Types } from 'mongoose';
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
  ) { }

  async create(createCompanyDTO: CreateCompanyDTO, user: IUser): Promise<ICompany[]> {
    try {
      console.time('all')
      const session = await this.databaseService.startSession();
      let company: ICompany[];
      console.time('withTransaction')
      await session.withTransaction(async () => {
        console.time('withTransaction-inside')
        const addressDTO = await ConstructObjectFromDtoHelper.constructCreateAddressObject(createCompanyDTO, user)
        const address = await this.addressService.create(addressDTO, session)

        const billingDTO = await ConstructObjectFromDtoHelper.constructCreateBillingInfoObject(createCompanyDTO, user)
        const billingInfo = await this.billingService.create(billingDTO, session)
        // const addressDTO = await ConstructObjectFromDtoHelper.ConstructCreateAddressObject(createCompanyDTO, user);
        // const billingDTO = await ConstructObjectFromDtoHelper.ConstructCreateBillingInfoObject(createCompanyDTO, user);

        // Use Promise.all() to create address and billing concurrently
        // const [address, billingInfo] = await Promise.all([
        //   this.addressService.create(addressDTO, session),
        //   this.billingService.create(billingDTO, session)
        // ]);
        console.time('validationCheck')
        // Assuming these methods return promises
        const zipCodeValidationPromise = ZipCodeValidator.validate(createCompanyDTO?.zipCode);
        const einDuplicateCheckPromise = this.einDuplicateCheck(createCompanyDTO?.ein);
        const dateCheckPromise = this.validDateCheck(createCompanyDTO?.startDate, createCompanyDTO?.endDate);
        const emailCheckPromise = this.duplicateEmailCheck(createCompanyDTO?.email, createCompanyDTO?.masterEmail);

        // Execute all promises concurrently
        await Promise.all([zipCodeValidationPromise, einDuplicateCheckPromise, dateCheckPromise, emailCheckPromise]);
        console.timeEnd('validationCheck')
        const companyCreateDTO = await ConstructObjectFromDtoHelper.ConstructCreateCompanyObject(user, createCompanyDTO, address[0], billingInfo[0])
        company = await this.companyModel.create([companyCreateDTO], { session });
        console.timeEnd('withTransaction-inside')
      });
      console.timeEnd('withTransaction')

      session.endSession();
      console.timeEnd('all')
      return company;
    } catch (error) {
      ExceptionHelper.getInstance().defaultError(
        error?.message,
        error?.code,
        HttpStatus.BAD_REQUEST
      );
    }
  }
  // get company list
  async findAll(query: { page: string, size: string, query?: string }, user: IUser): Promise<ICompany[]> {
    let aggregate = [];
    let page: number = parseInt(query?.page), size: number = parseInt(query?.size);
    if (!query?.page || parseInt(query?.page) < 1) page = 1;
    if (!query?.size || parseInt(query?.size) < 1) size = 10;

    // filter by client id
    AggregationHelper.filterByMatchAndQueriesAll(aggregate, [{ clientId: new Types.ObjectId(user?.clientId) }]);

    AggregationHelper.lookupForIdForeignKey(aggregate, "addresses", "addressId", "addresses");
    AggregationHelper.unwindWithPreserveNullAndEmptyArrays(aggregate, "addresses");

    // searching by 
    let trimmedQuery = null;
    if (query.query) {
      trimmedQuery = query.query.trim();
    }

    if (trimmedQuery) {
      const escapedQuery = trimmedQuery.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
      aggregate.push({
        $match: {
          $or: [
            {
              name: { $regex: escapedQuery, $options: "i" }
            },
            { email: { $regex: escapedQuery, $options: "i" } },
            { phone: { $regex: escapedQuery, $options: "i" } },
            { "addresses.city": { $regex: escapedQuery, $options: "i" } },
            { "addresses.state": { $regex: escapedQuery, $options: "i" } },
          ]
        }
      });
    }

    AggregationHelper.getCountAndDataByFacet(aggregate, +page, +size);

    const companies = await this.companyModel.aggregate(aggregate).exec();

    return companies;
  }

  async findOne(id: string): Promise<ICompany> {
    MongooseHelper.getInstance().isValidMongooseId(id)
    const oId = MongooseHelper.getInstance().makeMongooseId(id)
    const aggregate = [
      { $match: { _id: oId } }
    ]
    AggregationHelper.lookupForIdForeignKey(aggregate, 'addresses', 'addressId', 'address')
    AggregationHelper.lookupForIdForeignKey(aggregate, 'billinginfos', 'billingInfoId', 'billingInfo')
    AggregationHelper.unwindWithPreserveNullAndEmptyArrays(aggregate, 'address')
    AggregationHelper.unwindWithPreserveNullAndEmptyArrays(aggregate, 'billingInfo')
    const companies = await this.companyModel.aggregate(aggregate)
    const company = NestHelper.getInstance().arrayFirstOrNull(companies)
    if (NestHelper.getInstance().isEmpty(company)) {
      ExceptionHelper.getInstance().defaultError(
        'No company found',
        'no_company_found',
        HttpStatus.BAD_REQUEST
      );
    }
    return company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDTO): Promise<ICompany> {
    return await this.companyModel.findByIdAndUpdate(id, updateCompanyDto, { new: true }).lean();
  }

  async remove(id: string): Promise<ICompany> {
    return await this.companyModel.findByIdAndRemove(id).lean();
  }
  async findOneByEmail(email: string, masterEmail: string): Promise<ICompany> {
    return await this.companyModel.find({ $or: [{ email: email }, { masterEmail: masterEmail }] }).lean();
  }
  //private functions

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
    const isCompanyExistByEmail = await this.findOneByEmail(email, masterEmail);
    if (!NestHelper.getInstance().isEmpty(isCompanyExistByEmail)) {
      ExceptionHelper.getInstance().defaultError(
        'Duplicate email or master email',
        'duplicate_email_or_master_email',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  private validDateCheck(startDate: string, endDate: string) {
    if (!NestHelper.getInstance().isEmpty(endDate)) {
      const isStartDateGreater = new DateHelper().isSecondDateGreaterOrEqual(new Date().toISOString(), startDate);
      if (!isStartDateGreater) {
        ExceptionHelper.getInstance().defaultError(
          'StartDate must be greater than Today',
          'startDate_must_be_greater_than_today',
          HttpStatus.BAD_REQUEST
        );
      }
      const isEndDateGreater = new DateHelper().isSecondDateGreater(startDate, endDate);
      if (!isEndDateGreater) {
        ExceptionHelper.getInstance().defaultError(
          'EndDate must be greater than StartDate',
          'endDate_must_be_greater_than_StartDate',
          HttpStatus.BAD_REQUEST
        );
      }
    }
  }

}
