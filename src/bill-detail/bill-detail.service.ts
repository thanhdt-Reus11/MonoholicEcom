import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBillDetailDto } from './dto/create-bill-detail.dto';
import { UpdateBillDetailDto } from './dto/update-bill-detail.dto';
import { InjectModel } from '@nestjs/mongoose';
import { BillDetail, BillDetailDocument } from './schemas/bill-detail.schema';
import mongoose, { Model } from 'mongoose';
import { Query } from 'express-serve-static-core';
import { MongooseHelper } from 'src/helpers/mongoose.helper';

@Injectable()
export class BillDetailService {

  constructor(
    @InjectModel(BillDetail.name)
    private readonly billDetailModel: Model<BillDetailDocument>,
  ) {}

  async create(
    createBillDetailDto: CreateBillDetailDto
    )  {
    const billDetail = this.billDetailModel.create(createBillDetailDto);
    return billDetail;
  }


  async findAll(query : Query) : Promise<BillDetailDocument[]> {

    const {product, bill, quantity, sort, fields} = query;
    let searchOptions: any = {};

    if (product) {
      searchOptions.product_id = new mongoose.Types.ObjectId(product.toString());
    }

    if(quantity) {
      searchOptions.quantity = quantity;
    }

    if (bill) {
      searchOptions.bill_id = new mongoose.Types.ObjectId(bill.toString());
    }
     
    var fieldList : string;
    if(fields) {
      fieldList = fields.toString().split(',').join(' ');
    }
    else {
      fieldList = '_id quantity discount product_id';
    }

    let sortOptions: any = {};

    if (sort && typeof sort === 'string') {
      const sortFields = sort.split(',');

      for (const field of sortFields) {
        const sortOrder = field.startsWith('-') ? -1 : 1;
        const fieldName = field.replace(/^-/, '');
  
        sortOptions[fieldName] = sortOrder;
      }
    }
    else {
      sortOptions = { createdAt: -1 };
    }

    const data = await this.billDetailModel
                              .find({...searchOptions})
                              .sort(sortOptions)
                              .select(fieldList)
                              .populate('product_id','_id title price');

    return data;
  }

  async findDetailsWithProduct(id: string) {

    const helperQuery = new MongooseHelper(this.billDetailModel);
    const data = await helperQuery.query({
      bill_id: new mongoose.Types.ObjectId(id),
    }).lookup('product_id', 'products').excute();

    return data;
  }

  async findOne(id: string) : Promise<BillDetail> {
    const helperQuery = new MongooseHelper(this.billDetailModel);
    const data = helperQuery.byID(id);
    return data;
  }

  async update(id: string, updateBillDetailDto: UpdateBillDetailDto) : Promise<BillDetail>{
    if(!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Bad request!');
    }

    const data = await this.billDetailModel.findByIdAndUpdate(id, updateBillDetailDto, {
      new: true,
      runValidators: true
    });

    if(!data) {
      throw new NotFoundException('Not found bill-detail');
    }

    return data;
  }

  async removeByIdBill(id: string) {
    const result = await this.billDetailModel.deleteMany({bill_id: id});
    return {
      "status": "OK",
      "message": result.deletedCount
    }
  }
}
