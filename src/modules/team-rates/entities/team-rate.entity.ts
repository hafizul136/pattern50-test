import { StatusEnum } from "@common/enums/status.enum";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

export type TeamRateDocument = TeamRate & Document;

@Schema({ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } })
export class TeamRate {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "RateSheet", required: true })
    rateSheetId: mongoose.Schema.Types.ObjectId;

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

    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: "EmployeeRole" })
    employeeRoleId: mongoose.Schema.Types.ObjectId;

    @Prop({ type: Number, required: true })
    internalRate: number

    @Prop({ type: Number, required: true })
    billRate: number
}

export const TeamRateSchema = SchemaFactory.createForClass(TeamRate);
