export interface CompanyAddressModel {
    name: string;
    status: string;
    details: string; 
    clientId: string;
}
export interface IAddress {
    country?: string;
    city?: string;
    state?: string;
    zip?: string;
    address?: string;
    status?: string;
    _id?: string;
    created_at?: Date;
    updated_at?: Date;
    __v?: number;
}
