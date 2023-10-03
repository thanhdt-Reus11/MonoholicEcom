import { Module } from '@nestjs/common';
import { BillService } from './bill.service';
import { BillController } from './bill.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Bill, BillSchema } from './schemas/bill.schema';
import { BillDetailModule } from 'src/bill-detail/bill-detail.module';



@Module({
  imports: [
    BillDetailModule,
    MongooseModule.forFeature([{name:Bill.name, schema:BillSchema}]),
  ],
  controllers: [BillController],
  providers: [BillService],
  exports: [BillService]
})
export class BillModule {}
