import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { roleStatusEnum } from '../enum/index.enum';

export type RoleDocument = Role & Document;

@Schema({
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, toJSON: { virtuals: true },
    toObject: { virtuals: true }
})
export class Role {

    @Prop({ type: String, required: true })
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

    // Define the virtual field rolePermission
    // get rolePermission(): string {
    //     return 'Computed role permission'; // Replace with your logic
    // }

}

export const RoleSchema = SchemaFactory.createForClass(Role);
RoleSchema.virtual('rolePermission').get(function (this: any) {
    // Define the logic to compute the value of 'abc' here
    return `${this.name}--- ${this.name}`; // Example: Concatenate firstName and lastName
});
