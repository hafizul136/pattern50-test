import { StatusEnum } from '@common/enums/status.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { RegistrationTypeEnum, UserTypeEnum } from '../enum/index.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class User {
    @Prop({ type: String, required: true })
    firstName: string;

    @Prop({ type: String, required: true })
    lastName: string;

    @Prop({ type: String, required: true, unique: true, indexed: true })
    email: string;

    @Prop({ type: String, required: true })
    password: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "UserRole", default: null })
    userRoleId: mongoose.Schema.Types.ObjectId;

    @Prop({ type: String, default: '' })
    verificationCode: string;

    @Prop({ type: String, enum: RegistrationTypeEnum, default: RegistrationTypeEnum.password })
    registrationType: RegistrationTypeEnum;

    @Prop({ type: String, enum: UserTypeEnum, default: UserTypeEnum.admin })
    userType: string;

    @Prop({
        type: String,
        enum: [StatusEnum],
        default: StatusEnum.active,
    })
    status: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Client" })
    clientId: mongoose.Schema.Types.ObjectId;

    @Prop({ type: Boolean, default: true })
    isRegistered: boolean;

    @Prop({ type: Boolean, default: false })
    isVerified: boolean;

    @Prop({ type: Boolean, default: false })
    isDeleted: boolean;

    @Prop({ type: Date, default: new Date() })
    lastLogin: string;
    @Prop({ type: String, default: "" })
    phone: string;
    @Prop({ type: String, default: "" })
    stripeCustomerId: string;

}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ email: 1, clientId: 1 }, { unique: true })
