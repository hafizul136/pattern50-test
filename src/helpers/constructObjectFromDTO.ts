import { EINSecureHelper } from "@common/helpers/EinHelper";
import { CreateCompanyDTO } from "@modules/company/dto/create-company.dto";
import { IUser } from "@modules/users/interfaces/user.interface";
import { appConfig } from "configuration/app.config";
import mongoose from "mongoose";

export class ConstructObjectFromDtoHelper {
    static async ConstructCreateCompanyObject(user: IUser,createCompanyDTO: CreateCompanyDTO, address: any, billingInfo: any) {
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
    static async ConstructCreateAddressObject(createCompanyDto: CreateCompanyDTO, user: IUser) {
        return {
            addressLine: createCompanyDto?.addressLine ?? "",
            country: createCompanyDto?.country ?? "",
            city: createCompanyDto?.city ?? "",
            state: createCompanyDto?.state ?? "",
            zipCode: createCompanyDto?.zipCode ?? "",
        }
    }
    static async ConstructCreateBillingInfoObject(createCompanyDto: CreateCompanyDTO, user: IUser) {
        return {
            startDate: createCompanyDto?.startDate ?? "",
            endDate: createCompanyDto?.endDate ?? "",
        }
    }
}