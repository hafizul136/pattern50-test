import { StatusEnum } from "@common/enums/status.enum";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type RateSheetDocument = RateSheet & Document;

@Schema({ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } })
export class RateSheet {
    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: Date, default: new Date() })
    startDate: Date;

    @Prop({ type: Date, default: null })
    endDate: Date;

    @Prop({
        type: String,
        enum: [StatusEnum],
        default: StatusEnum.ACTIVE
    })
    status: string;
}

export const RateSheetSchema = SchemaFactory.createForClass(RateSheet);