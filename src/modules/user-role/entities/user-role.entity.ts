import { StatusEnum } from "@common/enums/status.enum";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

export type UserRoleDocument = UserRole & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class UserRole {
    @Prop({ type: mongoose.Types.ObjectId, ref: "User", default: '' })
    userId: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Types.ObjectId, ref: "Role", default: '' })
    roleId: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Types.ObjectId, ref: "Client", default: '1000' })
    clientId: mongoose.Types.ObjectId;

    @Prop({
        type: String,
        enum: [StatusEnum],
        default: StatusEnum.ACTIVE,
    })
    status: string
}

export const UserRoleSchema = SchemaFactory.createForClass(UserRole);
