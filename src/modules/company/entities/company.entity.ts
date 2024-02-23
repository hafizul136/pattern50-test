import { StatusEnum } from "@common/enums/status.enum";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";


export type CompanyDocument = Company & Document;
@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Company {
    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String, required: true, unique: true, index: true })
    email: string;

    @Prop({ type: String, required: true, unique: true, index: true })
    masterEmail: string;

    @Prop({ type: String, required: true })
    phone: string;

    @Prop({ type: mongoose.Types.ObjectId, ref: 'User', required: true, index: true })
    userId: mongoose.Types.ObjectId;

    @Prop({ type: String, required: true, index: true, unique: true })
    ein: string;

    // @Prop({ type: String })
    // logoUrl: string;

    @Prop({ type: mongoose.Types.ObjectId, ref: 'Address', required: true })
    addressId: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true, index: true })
    clientId: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Types.ObjectId, ref: 'BillingInfo', required: true })
    billingInfoId: mongoose.Types.ObjectId;

    @Prop({
        type: String,
        enum: [StatusEnum],
        default: StatusEnum.ACTIVE
    })
    status: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
CompanySchema.index({ status: 1 })