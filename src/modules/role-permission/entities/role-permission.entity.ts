import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";


export type RolePermissionDocument = RolePermission & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class RolePermission {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Client", default: '1000' })
    clientId: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Permission", default: '' })
    permissionId: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Role", default: '' })
    roleId: mongoose.Schema.Types.ObjectId;

}

export const RolePermissionSchema = SchemaFactory.createForClass(RolePermission);
