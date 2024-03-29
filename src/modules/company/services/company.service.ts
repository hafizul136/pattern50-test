import { EINSecureHelper } from '@common/helpers/EinHelper';
import { ExceptionHelper } from '@common/helpers/ExceptionHelper';
import { NestHelper } from '@common/helpers/NestHelper';
import { AggregationHelper } from '@common/helpers/aggregation.helper';
import { ConstructObjectFromDtoHelper } from '@common/helpers/constructObjectFromDTO';
import { DateHelper } from '@common/helpers/date.helper';
import { MongooseHelper } from '@common/helpers/mongooseHelper';
import { Utils } from '@common/helpers/utils';
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

  async create(createCompanyDTO: CreateCompanyDTO, user: IUser): Promise<ICompany> {
    try {
      const session = await this.databaseService.startSession();
      let companies: ICompany[];
      await session.withTransaction(async () => {
        // Assuming these methods return promises
        const zipCodeValidationPromise = ZipCodeValidator.validate(createCompanyDTO?.zipCode);
        const dateCheckPromise = this.validDateCheck(createCompanyDTO?.startDate, createCompanyDTO?.endDate);

        const uniqueCheckEmailAndEIN = this.uniqueCheckEmailAndEIN(createCompanyDTO);
        // Execute all promises concurrently
        await Promise.all([zipCodeValidationPromise, dateCheckPromise, uniqueCheckEmailAndEIN]);

        const addressDTO = ConstructObjectFromDtoHelper.constructCreateAddressObject(createCompanyDTO)
        const billingDTO = ConstructObjectFromDtoHelper.constructCreateBillingInfoObject(createCompanyDTO)

        const address = await this.addressService.create(addressDTO, session)
        const billingInfo = await this.billingService.create(billingDTO, session)

        const companyCreateDTO = await ConstructObjectFromDtoHelper.constructCreateCompanyObject(user, createCompanyDTO, address, billingInfo)
        companies = await this.companyModel.create([companyCreateDTO], { session });

      });
      session.endSession();
      const company = NestHelper.getInstance().arrayFirstOrNull(companies)
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
  async findAll(query: { page: string, size: string, query?: string }, user: IUser): Promise<{ data?: ICompany[], count?: number }> {
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
      const escapedQForPhone = trimmedQuery.replace(/[*]/g, "\\$&");
      const phoneQuery = escapedQForPhone.replace(/[()\s-]/g, "");
      const escapedQuery = trimmedQuery.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
      aggregate.push({
        $match: {
          $or: [
            {
              name: { $regex: escapedQuery, $options: "i" }
            },
            { email: { $regex: escapedQuery, $options: "i" } },
            { phone: { $regex: phoneQuery, $options: "i" } },
            { "addresses.city": { $regex: escapedQuery, $options: "i" } },
            { "addresses.state": { $regex: escapedQuery, $options: "i" } },
          ]
        }
      });
    }

    AggregationHelper.getCountAndDataByFacet(aggregate, +page, +size);

    const companies = await this.companyModel.aggregate(aggregate).exec();

    return Utils.returnListResponse(companies);
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
    if (NestHelper.getInstance().isEmpty(companies)) {
      ExceptionHelper.getInstance().defaultError(
        'No company found',
        'no_company_found',
        HttpStatus.BAD_REQUEST
      );
    }
    const company = NestHelper.getInstance().arrayFirstOrNull(companies)
    const ein = await EINSecureHelper.decrypt(company?.ein, appConfig?.einHashedSecret);
    company['ein'] = ein
    return company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDTO, user: IUser): Promise<ICompany> {
    MongooseHelper.getInstance().isValidMongooseId(id)
    const oId = MongooseHelper.getInstance().makeMongooseId(id)
    //check company existence
    const existingCompany: ICompany = await this.findOneById(oId)
    //hashed EIN 

    let ein: string;
    if (updateCompanyDto?.ein) {
      const hashedEin = await EINSecureHelper.getEinHashed(updateCompanyDto?.ein);
      ein = hashedEin;
      updateCompanyDto['ein'] = ein
    }

    // Assuming these methods return promises
    const zipCodeValidationPromise = ZipCodeValidator.validate(updateCompanyDto?.zipCode);
    const dateCheckPromise = this.validDateCheck(updateCompanyDto?.startDate, updateCompanyDto?.endDate);
    const uniqueCheckCompanyEmailAndEIN = await this.uniqueCheckCompanyEmailAndEIN(existingCompany?._id, updateCompanyDto);
    // Execute all promises concurrently
    await Promise.all([zipCodeValidationPromise, dateCheckPromise, uniqueCheckCompanyEmailAndEIN]);

    // Update address, billing info, and company concurrently
    const [address, billingInfo, company] = await Promise.all([
      this.addressService.update(existingCompany?.addressId, updateCompanyDto),
      this.billingService.update(existingCompany?.billingInfoId, updateCompanyDto),
      await this.companyModel.findByIdAndUpdate(id, updateCompanyDto, { new: true }).lean()
    ]);
    return { ...company, address, billingInfo }
  }

  // async remove(id: string): Promise<ICompany> {
  //   return await this.companyModel.findByIdAndRemove(id).lean();
  // }
  async findOneByEmail(email: string, masterEmail: string): Promise<ICompany> {
    return await this.companyModel.findOne({ $or: [{ email: email }, { masterEmail: masterEmail }] }).lean();
  }
  async findOneById(id: Types.ObjectId): Promise<ICompany> {
    const company = await this.companyModel.findOne({ _id: id }).lean()
    if (NestHelper.getInstance().isEmpty(company)) {
      ExceptionHelper.getInstance().defaultError(
        'No company found',
        'no_company_found',
        HttpStatus.BAD_REQUEST
      );
    }
    return company;
  }
  //private functions
  private async uniqueCheckEmailAndEIN(createCompanyDTO: CreateCompanyDTO) {
    const a = await this.checkDuplicateEmailAndEIN(createCompanyDTO?.ein, createCompanyDTO?.email, createCompanyDTO?.masterEmail);
    if (!NestHelper.getInstance()?.isEmpty(a[0].byEIN)) {
      ExceptionHelper.getInstance().defaultError(
        'EIN already exists',
        'EIN _already_exists',
        HttpStatus.BAD_REQUEST
      );
    }
    if (!NestHelper.getInstance().isEmpty(a[0].byEmail)) {
      ExceptionHelper.getInstance().defaultError(
        'Email address already exists',
        'email_address_already_exists',
        HttpStatus.BAD_REQUEST
      );
    }
    if (!NestHelper.getInstance()?.isEmpty(a[0].byMasterEmail)) {
      ExceptionHelper.getInstance().defaultError(
        'Master email address already exists',
        'master_email_address_already_exists',
        HttpStatus.BAD_REQUEST
      );
    }
  }
  private async uniqueCheckCompanyEmailAndEIN(companyId: Types.ObjectId, createCompanyDTO: CreateCompanyDTO) {
    const a = await this.checkDuplicateCompanyEmailAndEIN(companyId, createCompanyDTO?.ein, createCompanyDTO?.email, createCompanyDTO?.masterEmail);
    if (!NestHelper.getInstance()?.isEmpty(a[0].byEIN)) {
      ExceptionHelper.getInstance().defaultError(
        'EIN already exists',
        'EIN _already_exists',
        HttpStatus.BAD_REQUEST
      );
    }
    if (!NestHelper.getInstance().isEmpty(a[0].byEmail)) {
      ExceptionHelper.getInstance().defaultError(
        'Email address already exists',
        'email_address_already_exists',
        HttpStatus.BAD_REQUEST
      );
    }
    if (!NestHelper.getInstance()?.isEmpty(a[0].byMasterEmail)) {
      ExceptionHelper.getInstance().defaultError(
        'Master email address already exists',
        'master_email_address_already_exists',
        HttpStatus.BAD_REQUEST
      );
    }
  }
  private async checkDuplicateEmailAndEIN(ein: string, emailTemp: string, masterEmailTemp: string) {
    const emailPipeline = [
      {
        $match: { email: emailTemp }
      },
    ];
    const masterEmailPipeline = [
      {
        $match: { masterEmail: masterEmailTemp }
      },
    ];

    const hashedEIN = await EINSecureHelper.encrypt(ein, appConfig.einHashedSecret);
    const einPipeline = [
      {
        $match: { ein: hashedEIN },
      },

    ];

    return this.companyModel.aggregate([
      {
        $facet: {
          byEmail: emailPipeline,
          byMasterEmail: masterEmailPipeline,
          byEIN: einPipeline,
        },
      },
    ])
  }
  private async checkDuplicateCompanyEmailAndEIN(companyId: Types.ObjectId, EIN: string, emailTemp: string, masterEmailTemp: string) {
    const emailPipeline = [
      {
        $match: { _id: { $ne: companyId }, email: emailTemp },
      },
    ];
    const masterEmailPipeline = [
      {
        $match: { _id: { $ne: companyId }, masterEmail: masterEmailTemp },
      },
    ];

    const einPipeline = [
      {
        $match: { _id: { $ne: companyId }, ein: EIN },
      },

    ];

    const res = await this.companyModel.aggregate([
      {
        $facet: {
          byEmail: emailPipeline,
          byMasterEmail: masterEmailPipeline,
          byEIN: einPipeline,
        },
      },
    ])
    return res
  }

  private validDateCheck(startDate: string, endDate: string) {
    const dateFormat = 'yyyy-MM-dd';
    const formattedStartDate = new DateHelper().formatDateAccordingToHour(
      startDate,
      dateFormat
    );
    const today = new DateHelper().formatDateWithoutTime(new Date())
    const isStartDateGreater = new DateHelper().isSecondDateGreaterOrEqual(today, formattedStartDate);
    if (!isStartDateGreater) {
      ExceptionHelper.getInstance().defaultError(
        'StartDate must be greater than Today',
        'startDate_must_be_greater_than_today',
        HttpStatus.BAD_REQUEST
      );
    }

    if (!NestHelper.getInstance().isEmpty(endDate)) {
      const formattedEndDate = new DateHelper().formatDateAccordingToHour(
        endDate,
        dateFormat
      );
      const isEndDateGreater = new DateHelper().isSecondDateGreaterOrEqual(formattedStartDate, formattedEndDate);
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
