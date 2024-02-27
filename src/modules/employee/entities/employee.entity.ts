import { StatusEnum } from '@common/enums/status.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { WorkingStatusEnum } from '../dto/create-employee.dto';

export type EmployeeDocument = Employee & Document;

@Schema({
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }})
export class Employee {

    @Prop({ type: String, required: true })
    firstName: string;

    @Prop({ type: String, required: true })
    lastName: string;

    @Prop({ type: mongoose.Types.ObjectId })
    employeeRoleId: mongoose.Types.ObjectId;

    @Prop({ type: Date })
    startDate: Date;

    @Prop({ type: WorkingStatusEnum })
    workingStatus: WorkingStatusEnum.FULL_TIME;

    @Prop({
        type: String,
        enum: [StatusEnum],
        default: StatusEnum.ACTIVE,
    })
    status: string

    @Prop({ type: String, default: '' })
    responsibility: string;

    @Prop({ type: String, default: '' })
    image: string;

    @Prop({ type: mongoose.Types.ObjectId })
    clientId: mongoose.Types.ObjectId;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
