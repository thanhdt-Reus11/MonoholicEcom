import { PartialType } from '@nestjs/mapped-types';
import { CreateBillDto } from './create-bill.dto';
import { IsEmpty, IsNotEmpty } from 'class-validator';
import { User } from 'src/user/schemas/user.schema';

export class UpdateBillDto {
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

    readonly fullfillment_status: number;
}
