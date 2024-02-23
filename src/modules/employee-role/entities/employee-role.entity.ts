import { StatusEnum } from "@common/enums/status.enum";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type EmployeeRoleDocument = EmployeeRole & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class EmployeeRole {
    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String, default: '' })
    description: string;

    @Prop({ type: Date, required: true, default: new Date() })
    startDate: Date;

    @Prop({ type: Date, default: null })
    endDate: Date;

    @Prop({
        type: String,
        enum: [StatusEnum.ACTIVE, StatusEnum.INACTIVE],
        default: StatusEnum.ACTIVE,
        required: true
    })
    status: string;

    @Prop({ type: Boolean, required: true, default: false })
    isDeleted: boolean
}

export const employeeRoleSchema = SchemaFactory.createForClass(EmployeeRole);
