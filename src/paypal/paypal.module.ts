import { Module } from '@nestjs/common';
import { PaypalController } from './paypal.controller';
import { PaypalService } from './paypal.service';
import { BillModule } from 'src/bill/bill.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './schemas/payment.schema';

@Module({
  imports: [
    BillModule,
    MongooseModule.forFeature([{name: Payment.name, schema: PaymentSchema}]),
  ],
  controllers: [PaypalController],
  providers: [PaypalService]
})
export class PaypalModule {}
