import { StatusEnum } from '@common/enums/status.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CompanyAddressDocument = CompanyAddress & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class CompanyAddress {

    @Prop({ type: String, required: true })
    country: string;

    @Prop({ type: String, required: true })
    city: string;

    @Prop({ type: String, required: true })
    state: string;

    @Prop({ type: String, required: true })
    zip: string;

    @Prop({ type: String, required: true })
    address: string;

    @Prop({
        type: String,
        enum: [StatusEnum],
        default: StatusEnum.active,
    })
    status: string
}

export const CompanyAddressSchema = SchemaFactory.createForClass(CompanyAddress);
