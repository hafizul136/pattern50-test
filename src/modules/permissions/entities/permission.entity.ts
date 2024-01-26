import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { permissionStatusEnum } from '../enum/index.enum';

export type PermissionDocument = Permission & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Permission {
    @Prop({ type: String, unique: true, default: '' })
    name: string;

    @Prop({
        type: String,
        enum: [permissionStatusEnum],
        default: permissionStatusEnum.active,
    })
    status: string

    @Prop({ type: String, default: '' })
    details: string;

    @Prop({ type: mongoose.Types.ObjectId, ref: "Client", required: true, index: true })
    clientId: mongoose.Types.ObjectId;

}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
