import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type CountryDocument = Country & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Country {

    @Prop({ type: String, required: true })
    iso: string;

    @Prop({ type: String, required: true, index: true })
    country: string;

    @Prop({ type: String, required: true, unique: true, index: true })
    capital: string;

    @Prop({ type: String, required: true })
    currency_code: string;

    @Prop({ type: String, required: true })
    currency_name: string;

    @Prop({ type: String })
    currency_symbol?: string;

    @Prop({ type: String, required: true })
    phone: string;

    @Prop({ type: String, required: true, index: true })
    postal_code_format: string;

    @Prop({ type: String, default: '' })
    languages: string[];

    @Prop({ type: String, default: '' })
    country_id: string;

    @Prop({ type: String, default: '' })
    cities: {
        city_id: string;
        name: string;
    };
}
export const CountrySchema = SchemaFactory.createForClass(Country);