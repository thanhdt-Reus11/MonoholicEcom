import { IsEmpty } from 'class-validator';
import { Product } from 'src/product/schemas/product.shema';

export class UpdateBillDetailDto {
    @IsEmpty({message : 'Can not pass this field'})
    product_id: Product;
    
    quantity: number;

    discount: number;

    @IsEmpty({message : 'Can not pass this field'})
    bill_id: string;
}
