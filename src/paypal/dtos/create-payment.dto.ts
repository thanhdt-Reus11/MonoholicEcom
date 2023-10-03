import { IsNotEmpty, IsNumber } from "class-validator";
import { BillDocument } from "src/bill/schemas/bill.schema";

export class CreatePaymentDto {
    @IsNotEmpty()
    readonly bill_id: BillDocument;

    @IsNotEmpty()
    @IsNumber()
    readonly total: number
}