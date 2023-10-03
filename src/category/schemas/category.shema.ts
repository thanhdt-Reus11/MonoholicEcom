import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import  mongoose, {Document} from "mongoose"

export type CategoryDocument = Category & Document;

@Schema({timestamps:true})
export class Category {
    @Prop({unique: [true, 'Duplicate title entered!']})
    title: string;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref:'Category'})
    parent: Category;

    @Prop()
    status: number;
}

export const CategorySchema = SchemaFactory.createForClass(Category);