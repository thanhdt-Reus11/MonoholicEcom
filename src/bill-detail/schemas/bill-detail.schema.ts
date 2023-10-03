import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Product, ProductDocument } from "src/product/schemas/product.shema";

export type BillDetailDocument = BillDetail & Document;

@Schema({timestamps:true})
export class BillDetail {
    @Prop({type: mongoose.Schema.Types.ObjectId, ref:'Product'})
    product_id: ProductDocument;
    
    @Prop()
    quantity: number;

    @Prop()
    discount: number;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref:'Bill'})
    bill_id: string;
} 

export const BillDetailSchema = SchemaFactory.createForClass(BillDetail);