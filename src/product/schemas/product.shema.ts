import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Category } from "src/category/schemas/category.shema";
import { User, UserDocument } from "src/user/schemas/user.schema";

export type ProductDocument = Product & Document;

@Schema({timestamps:true})
export class Product{

    @Prop({unique: [true, 'Duplicate title entered!']})
    title: String;

    @Prop()
    summary: String;
    
    @Prop()
    body: String;

    @Prop()
    price: number;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref:'User'})
    user_id: UserDocument;

    @Prop()
    status: number;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref:'Category'})
    product_categories_id: Category;
}

export const ProductSchema = SchemaFactory.createForClass(Product);