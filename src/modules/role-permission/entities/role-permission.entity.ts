import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";


export type RolePermissionDocument = RolePermission & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class RolePermission {
    @Prop({ type: mongoose.Types.ObjectId, ref: "Client", default: '1000' })
    clientId: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Types.ObjectId, ref: "Permission", default: '' })
    permissionId: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Types.ObjectId, ref: "Role", default: '', index: true })
    roleId: mongoose.Types.ObjectId;

}

export const RolePermissionSchema = SchemaFactory.createForClass(RolePermission);
