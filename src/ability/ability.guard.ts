import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { AbilityFactory } from "./ability.factory";
import { Reflector } from "@nestjs/core";
import { CHECK_ABILITY, RequiredRule } from "./ability.decorator";
import { ForbiddenError } from "@casl/ability";
import { ProductController } from "src/product/product.controller";

@Injectable()
export class AbilityGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private abilityFactory: AbilityFactory
    ) {}

    canActivate(context: ExecutionContext) {
        const requiredRules = this.reflector.getAllAndOverride<RequiredRule>(CHECK_ABILITY, [
            context.getClass(),
            context.getHandler()
        ])

        if(!requiredRules) {
            return true;
        }

        

        const id = this.reflector.get<string>('id', ProductController);
        if(id) {
            console.log(id);
        }

        const { user } = context.switchToHttp().getRequest();
        const ability = this.abilityFactory.defineAbility(user);



        try {
            
            ForbiddenError.from(ability).throwUnlessCan(requiredRules.action, requiredRules.subject);

            return true;
        } catch (error) {
            if (error instanceof ForbiddenError) {
                throw new ForbiddenException(error.message);
            }

            throw new BadRequestException(error.message);
        }
    }
} 