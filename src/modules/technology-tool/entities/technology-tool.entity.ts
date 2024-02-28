import { StatusEnum } from "@common/enums/status.enum";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export type TechnologyToolDocument = Document & TechnologyTool;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class TechnologyTool {
    @Prop({ type: String, required: true, defaultValue: "" })
    name: string;

    @Prop({ type: String, required: true, defaultValue: "" })
    type: string;

    @Prop({ type: String, required: true, defaultValue: "" })
    website: string;

    @Prop({ type: String, required: true, defaultValue: "" })
    logo: string;

    @Prop({ type: String, enum: [StatusEnum.ACTIVE, StatusEnum.DEACTIVATED], required: true })
    status: StatusEnum;
}

export const TechnologyToolSchema = SchemaFactory.createForClass(TechnologyTool);
