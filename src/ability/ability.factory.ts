import { AbilityBuilder, ExtractSubjectType, InferSubjects, MongoAbility, createMongoAbility } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { BillDocument } from "src/bill/schemas/bill.schema";
import { Product, ProductDocument } from "src/product/schemas/product.shema";
import { UserDocument } from "src/user/schemas/user.schema";

export enum Action {
    Manage = 'manage',
    Create = 'create',
    Read = 'read',
    Update = 'update',
    Delete = 'delete'
}

export type Subjects = InferSubjects<typeof Product> | 'all';

@Injectable()
export class AbilityFactory {
    defineAbility (user : UserDocument) {
        const { can, cannot, build } = new AbilityBuilder<MongoAbility<[Action, Subjects]>>(createMongoAbility);

        if (user.roles.includes('admin')) {
            can(Action.Manage, 'all');
        }
        else if (user.roles.includes('seller')) {
            can(Action.Manage, Product);
        }
        
        can(Action.Read, Product);


        return build({
            detectSubjectType: (item) =>
                item.constructor as ExtractSubjectType<{}>,
        });
    }
}