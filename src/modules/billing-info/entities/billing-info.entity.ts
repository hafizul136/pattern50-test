import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
export type BillingInfoDocument = BillingInfo & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class BillingInfo {
    @Prop({ type: Date, default: new Date() })
    startDate: Date;

    @Prop({ type: Date, default: null })
    endDate: Date;
}
export const BillingInfoSchema = SchemaFactory.createForClass(BillingInfo);
