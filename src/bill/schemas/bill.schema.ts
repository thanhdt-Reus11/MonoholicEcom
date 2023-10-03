import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { BillDetailDocument } from "src/bill-detail/schemas/bill-detail.schema";
import { UserDocument } from "src/user/schemas/user.schema";

export type BillDocument = Bill & Document;

@Schema({timestamps: true})
export class Bill {
    @Prop({ required: true, unique: true })
    code: String
    
    @Prop({type: mongoose.Schema.Types.ObjectId, ref:'User'})
    user_id: UserDocument;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BillDetail' }] })
    details: BillDetailDocument[];

    @Prop({default:0})
    total: number

    @Prop({default:0})
    discount: number

    @Prop({default:0})
    payment_total: number

    @Prop({default:1})
    fullfillment_status: number
}

export const BillSchema = SchemaFactory.createForClass(Bill);