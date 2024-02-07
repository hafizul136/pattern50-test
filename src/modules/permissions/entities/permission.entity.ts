import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
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

}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
