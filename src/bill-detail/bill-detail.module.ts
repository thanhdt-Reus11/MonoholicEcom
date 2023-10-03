import { Module } from '@nestjs/common';
import { BillDetailService } from './bill-detail.service';
import { BillDetailController } from './bill-detail.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BillDetail, BillDetailSchema } from './schemas/bill-detail.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name:BillDetail.name, schema:BillDetailSchema}]),
  ],
  controllers: [BillDetailController],
  providers: [BillDetailService],
  exports: [BillDetailService],
})
export class BillDetailModule {}
