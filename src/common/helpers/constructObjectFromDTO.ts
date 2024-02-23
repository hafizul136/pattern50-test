import { StatusEnum } from "@common/enums/status.enum";
import { EINSecureHelper } from "@common/helpers/EinHelper";
import { CreateCompanyDTO } from "@modules/company/dto/create-company.dto";
import { CreateEmployeeRoleDto } from "@modules/employee-role/dto/create-employee-role.dto";
import { IUser } from "@modules/users/interfaces/user.interface";
import mongoose from "mongoose";
import { DateHelper } from "./date.helper";

export class ConstructObjectFromDtoHelper {
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

    static constructCreateAddressObject(createCompanyDto: CreateCompanyDTO, user: IUser) {
        return {
            addressLine: createCompanyDto?.addressLine ?? "",
            country: createCompanyDto?.country ?? "",
            city: createCompanyDto?.city ?? "",
            state: createCompanyDto?.state ?? "",
            zipCode: createCompanyDto?.zipCode ?? "",
        }
    }

    static constructCreateBillingInfoObject(createCompanyDto: CreateCompanyDTO, user: IUser) {
        return {
            startDate: createCompanyDto?.startDate ?? "",
            endDate: createCompanyDto?.endDate ?? "",
        }
    }

    static constructEmployeeRoleObj(employeeRoleDto: CreateEmployeeRoleDto) {
        return {
            name: employeeRoleDto?.name ?? "",
            description: employeeRoleDto?.description.trim() ?? "",
            status: StatusEnum.ACTIVE,
            isDeleted: false,
            startDate: new DateHelper().now("UTC")
        }
    }
}