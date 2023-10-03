import { IsEmpty, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Product } from "src/product/schemas/product.shema";

export class CreateBillDetailDto {
    
    @IsNotEmpty()
    @IsString()
    product_id: Product;
    
    @IsNotEmpty()
    @IsNumber()
    quantity: number;

    @IsNotEmpty()
    @IsNumber()
    discount: number;

    @IsNotEmpty()
    @IsString()
    bill_id: string;
}
