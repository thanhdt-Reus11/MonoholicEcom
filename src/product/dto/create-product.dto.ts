import { IsEmpty, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Category } from "src/category/schemas/category.shema";
import { User } from "src/user/schemas/user.schema";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    readonly title: String;

    @IsNotEmpty()
    readonly summary: String;
    
    @IsNotEmpty()
    readonly body: String;

    @IsNotEmpty()
    @IsNumber()
    readonly price: number;

    @IsEmpty({message: 'You cannot pass this field'})
    readonly user_id: User;

    @IsNotEmpty()
    @IsNumber()
    readonly status: number;

    @IsNotEmpty()
    readonly product_categories_id: Category;
}
