import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema({timestamps: true})
export class User {
    @Prop()
    username: string;
    
    @Prop()
    password: string

    @Prop({unique: [true, 'Duplicate email entered!']})
    email: string;

    @Prop()
    roles: string[];

    @Prop()
    refresh_token: string;
}

export const UserSchema = SchemaFactory.createForClass(User);