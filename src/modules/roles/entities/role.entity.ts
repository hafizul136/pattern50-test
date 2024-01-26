import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { roleStatusEnum } from '../enum/index.enum';

export type RoleDocument = Role & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Role {

    @Prop({ type: String,required:true})
    name: string;

    @Prop({
        type: String,
        enum: [roleStatusEnum],
        default: roleStatusEnum.active,
    })
    status: string

    @Prop({ type: String, default: '' })
    details: string;

    @Prop({ type: mongoose.Types.ObjectId })
    clientId: mongoose.Types.ObjectId;

}

export const RoleSchema = SchemaFactory.createForClass(Role);
