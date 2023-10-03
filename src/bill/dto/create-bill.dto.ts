import { IsEmpty, IsNotEmpty, IsNumber, IsString, isNotEmpty } from "class-validator"
import { CreateBillDetailDto } from "src/bill-detail/dto/create-bill-detail.dto";
import { User } from "src/user/schemas/user.schema";

export class CreateBillDto {
    @IsEmpty({message:'You cannot pass this field'})
    readonly code: String;
    
    @IsEmpty({message:'You cannot pass this field'})
    readonly user_id: User;

    @IsEmpty({message:'You cannot pass this field'})
    readonly total: number;

    @IsEmpty({message:'You cannot pass this field'})
    readonly discount: number;

    @IsEmpty({message:'You cannot pass this field'})
    readonly payment_total: number;

    @IsNotEmpty()
    details: CreateBillDetailDto[];

    @IsEmpty({message:'You cannot pass this field'})
    readonly fullfillment_status: number;
}
