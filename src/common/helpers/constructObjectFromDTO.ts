import { StatusEnum } from "@common/enums/status.enum";
import { EINSecureHelper } from "@common/helpers/EinHelper";
import { CreateCompanyDTO } from "@modules/company/dto/create-company.dto";
import { ICompany } from "@modules/company/interfaces/company.interface";
import { CreateEmployeeRoleDto } from "@modules/employee-role/dto/create-employee-role.dto";
import { CreateEmployeeDTO } from "@modules/employee/dto/create-employee.dto";
import { UpdateEmployeeDto } from "@modules/employee/dto/update-employee.dto";
import { CreateTechnologyToolDto } from "@modules/technology-tool/dto/create-technology-tool.dto";
import { IUser } from "@modules/users/interfaces/user.interface";
import mongoose, { Types } from "mongoose";
import { DateHelper, StartAndEndDate } from "./date.helper";
import { MongooseHelper } from "./mongooseHelper";

export class ConstructObjectFromDtoHelper extends StartAndEndDate {
    static async constructCreateCompanyObject(user: IUser, createCompanyDTO: CreateCompanyDTO, address: any, billingInfo: any) {
        //hashed EIN 
        let ein: string
        if (createCompanyDTO?.ein) {
            const hashedEin = await EINSecureHelper.getEinHashed(createCompanyDTO?.ein);
            ein = hashedEin;
        }
        return {
            name: createCompanyDTO?.name ?? "",
            email: createCompanyDTO?.email ?? "",
            masterEmail: createCompanyDTO?.masterEmail ?? "",
            phone: createCompanyDTO?.phone ?? "",
            ein: ein ?? "",
            userId: new mongoose.Types.ObjectId(user?.userId),
            addressId: address?._id,
            billingInfoId: billingInfo?._id,
            clientId: new mongoose.Types.ObjectId(user?.clientId)

        }
    }
    static async constructUpdateCompanyObject(user: IUser, createCompanyDTO: CreateCompanyDTO, company: ICompany) {
        //hashed EIN 
        let ein: string = createCompanyDTO?.ein ?? createCompanyDTO?.ein
        if (createCompanyDTO?.ein) {
            const hashedEin = await EINSecureHelper.getEinHashed(createCompanyDTO?.ein);
            ein = hashedEin;
        }
        return {
            name: createCompanyDTO?.name ?? company?.name,
            email: createCompanyDTO?.email ?? company?.email,
            masterEmail: createCompanyDTO?.masterEmail ?? company?.masterEmail,
            phone: createCompanyDTO?.phone ?? company?.phone,
            ein: ein ?? company?.ein,
            userId: new mongoose.Types.ObjectId(user?.userId),
            addressId: company?.address?._id,
            billingInfoId: company?.billingInfo?._id,
            clientId: new mongoose.Types.ObjectId(user?.clientId)

        }
    }

    static constructCreateAddressObject(createCompanyDto: CreateCompanyDTO) {
        return {
            addressLine: createCompanyDto?.addressLine ?? "",
            country: createCompanyDto?.country ?? "",
            city: createCompanyDto?.city ?? "",
            state: createCompanyDto?.state ?? "",
            zipCode: createCompanyDto?.zipCode ?? "",
        }
    }
    static constructUpdateAddressObject(updateCompanyDto: CreateCompanyDTO, company: ICompany) {
        return {
            addressLine: updateCompanyDto?.addressLine ?? company?.address?.addressLine,
            country: updateCompanyDto?.country ?? company?.address?.country,
            city: updateCompanyDto?.city ?? company?.address?.city,
            state: updateCompanyDto?.state ?? company?.address?.state,
            zipCode: updateCompanyDto?.zipCode ?? company?.address?.zipCode,
        }
    }

    static constructCreateBillingInfoObject(createCompanyDto: CreateCompanyDTO) {
        return {
            startDate: new DateHelper().getTimeInISODate(new Date(createCompanyDto?.startDate)) ?? "",
            endDate: createCompanyDto?.endDate ? new DateHelper().getTimeInISODate(new Date(createCompanyDto?.endDate)) : "",
        }
    }
    static constructUpdateBillingInfoObject(createCompanyDto: CreateCompanyDTO, company: ICompany) {
        return {
            startDate: new DateHelper().getTimeInISODate(new Date(createCompanyDto?.startDate)) ?? new DateHelper().getTimeInISODate(new Date(company?.billingInfo?.startDate)),
            endDate: new DateHelper().getTimeInISODate(new Date(createCompanyDto?.endDate)) ?? new DateHelper().getTimeInISODate(new Date(company?.billingInfo?.endDate)),
        }
    }

    static constructEmployeeRoleObj(employeeRoleDto: CreateEmployeeRoleDto, clientId: mongoose.Types.ObjectId) {
        return {
            name: employeeRoleDto?.name ?? "",
            description: employeeRoleDto?.description.trim() ?? "",
            status: StatusEnum.ACTIVE,
            isDeleted: false,
            startDate: new DateHelper().now("UTC"),
            clientId: new Types.ObjectId(clientId)
        }
    }
    static async constructEmployeeObj(user: IUser, createEmployeeDto: CreateEmployeeDTO) {
        return {
            name: createEmployeeDto?.name ? createEmployeeDto?.name?.trim() : "",
            email: createEmployeeDto?.email ? createEmployeeDto?.email?.trim() : "",
            phone: createEmployeeDto?.phone ? createEmployeeDto?.phone?.trim() : "",
            employeeRoleIds: createEmployeeDto?.employeeRoleIds ?? "",
            clientId: new mongoose.Types.ObjectId(user?.clientId) ?? ""
        }
    }
    static constructEmployeeUpdateObj(user: IUser, updateEmployeeDto: UpdateEmployeeDto) {
        return {
            name: updateEmployeeDto?.name ? updateEmployeeDto?.name?.trim() : "",
            email: updateEmployeeDto?.email ? updateEmployeeDto?.email?.trim() : "",
            phone: updateEmployeeDto?.phone ? updateEmployeeDto?.phone?.trim() : "",
            employeeRoleIds: updateEmployeeDto?.employeeRoleIds ?? "",
            clientId: new mongoose.Types.ObjectId(user?.clientId) ?? ""
        }
    }

    static constructToolsObj(tool: CreateTechnologyToolDto) {
        // validate mongo ids
        MongooseHelper.getInstance().isValidMongooseId(tool?.categoryId);
        MongooseHelper.getInstance().isValidMongooseId(tool?.typeId);

        return {
            name: tool?.name ?? "",
            typeId: new Types.ObjectId(tool?.typeId) ?? "",
            categoryId: new Types.ObjectId(tool?.categoryId) ?? "",
            website: tool?.website ?? "",
            logo: tool?.logo ?? "",
            status: StatusEnum.ACTIVE,
        }
    }
}