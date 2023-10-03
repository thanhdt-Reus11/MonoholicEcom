import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { PaypalService } from './paypal.service';
import { SkipToken } from 'src/auth/skip-token.decorator';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Controller('paypal')
export class PaypalController {
    constructor(
        private readonly paypalService: PaypalService
    ) {}

    @SkipToken()
    @Get('create-payment/:id')
    async createPayment(
        @Param('id') id : string
    ) {
        return this.paypalService.createOrder(id);
    }

    @SkipToken()
    @Get('capture-payment/:id')
    async capturePayment(
        @Param('id') id :string
    ) {
        return this.paypalService.capturePayment(id);
    }

    @SkipToken()
    @Post('')
    async webhook(
        @Req() req : any
    ) {
        const body = req.body
        if(body?.event_type === 'CHECKOUT.ORDER.APPROVED') {
            const data = await this.capturePayment(body.resource.id);
            console.log(data);
        }
        else if (body?.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
            console.log('Completed');
        }
    }

}
