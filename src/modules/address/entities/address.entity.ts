import { StatusEnum } from '@common/enums/status.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AddressDocument = Address & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Address {

    @Prop({ type: String, required: true })
    addressLine: string;

    @Prop({ type: String, required: true })
    city: string;

    @Prop({ type: String, required: true })
    state: string;

    @Prop({ type: String, required: true })
    zipCode: string;

    @Prop({ type: String, required: true })
    country: string;

    @Prop({
        type: String,
        enum: [StatusEnum],
        default: StatusEnum.ACTIVE,
    })
    status: string
}

export const AddressSchema = SchemaFactory.createForClass(Address);
