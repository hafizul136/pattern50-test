import { StatusEnum } from '@common/enums/status.enum';
import { DateHelper } from '@common/helpers/date.helper';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type EmployeeDocument = Employee & Document;

@Schema({
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})
export class Employee {

    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String, required: true })
    email: string;

    @Prop({ type: String })
    phone: string;

    @Prop({ type: [mongoose.Types.ObjectId], ref: "EmployeeRole", required: true })
    employeeRoleIds: mongoose.Types.ObjectId[];

    @Prop({ type: Date, default: new DateHelper().now('UTC') })
    startDate: Date;

    // @Prop({ type: WorkingStatusEnum })
    // workingStatus: WorkingStatusEnum.FULL_TIME;

    @Prop({
        type: String,
        enum: [StatusEnum],
        default: StatusEnum.ACTIVE,
    })
    status: StatusEnum

    // @Prop({ type: String })
    // responsibility: string;

    // @Prop({ type: String })
    // image: string;

    @Prop({ type: mongoose.Types.ObjectId, required: true })
    clientId: mongoose.Types.ObjectId;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
