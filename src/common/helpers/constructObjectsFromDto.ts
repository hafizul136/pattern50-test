

export class ConstructObjectFromDtoHelper {
    static async getConstructedCreateCompanyObject(createCompanyDto: any) {
        return {
            name: createCompanyDto?.name ?? "",
            email: createCompanyDto?.email ?? "",
            phone: createCompanyDto?.phone ?? "",
            website: createCompanyDto?.website ?? "",
            logoUrl: createCompanyDto?.logoUrl ?? "",
        }
    }
}