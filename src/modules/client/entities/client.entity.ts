import { StatusEnum } from "@common/enums/status.enum";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ClientDocument = Client & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Client {
    @Prop({ type: String, default: '' })
    name: string;

    @Prop({
        type: String,
        enum: [StatusEnum],
        default: StatusEnum.active,
    })
    status: string

    @Prop({ type: String, default: '' })
    secret: string;

    @Prop({ type: Boolean, default: false })
    marketPlacePayment: boolean;
}

export const ClientSchema = SchemaFactory.createForClass(Client);