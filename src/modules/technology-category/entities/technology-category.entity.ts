import { StatusEnum } from "@common/enums/status.enum";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type technologyCategoryDocument = TechnologyCategory & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class TechnologyCategory {
    @Prop({ type: String, unique: true, required: true })
    name: string;

    @Prop({ type: String, enum: [StatusEnum.ACTIVE, StatusEnum.DEACTIVATED], required: true })
    status: StatusEnum;
}

export const TechnologyCategorySchema = SchemaFactory.createForClass(TechnologyCategory);
