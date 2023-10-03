import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { BillDocument } from "src/bill/schemas/bill.schema";

export type PaymentDocument = Payment & Document;

@Schema({timestamps: true})
export class Payment {
    
    @Prop({default: 1})
    type: number;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Bill'})
    bill_id: BillDocument;

    @Prop({required: true})
    total: number;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);