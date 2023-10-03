import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Bill, BillDocument } from './schemas/bill.schema';
import mongoose, { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/schemas/user.schema';
import { BillDetailService } from 'src/bill-detail/bill-detail.service';
import { Query } from 'express-serve-static-core'

@Injectable()
export class BillService {

  constructor(
    @InjectModel(Bill.name)
    private readonly billModel:Model<BillDocument>,
    private readonly billDetailService:BillDetailService,
  ) {}

  async create(createBillDto: CreateBillDto, user: UserDocument) : Promise<Bill> {
    const code = Date.now();

    const bill = await this.billModel.create({
      code: code,
      user_id: user._id,
    });

    await Promise.all(createBillDto.details.map(async (item) => {
      const dataDetail = Object.assign(item, {
        bill_id: bill._id
      });

      const billDetail = await (await this.billDetailService.create(dataDetail)).populate('product_id');

      bill.total = bill.total + billDetail.product_id.price * item.quantity;
      bill.discount = bill.discount + billDetail.discount;
      bill.details.push(billDetail._id);
    }))

    // for (const item of createBillDto.details) {
    //   const dataDetail = Object.assign(item, {
    //     bill_id: bill._id
    //   });

    //   const billDetail = await (await this.billDetailService.create(dataDetail)).populate('product_id');

    //   total = total + billDetail.product_id.price * item.quantity;
    //   discount = discount + billDetail.discount;
    //   details.push(billDetail._id);
    // }

    bill.payment_total = bill.total - bill.discount;

    bill.save();
    
    return bill;
  }

  async findAll(query: Query) : Promise<BillDocument[]> {

    const {code, user_id, sort, fields} = query;

    let searchOptions: any = {};

    if(code) {
      searchOptions.code = {
        $regex: code,
        $options: 'i',
      };
    }

    if(user_id) {
      searchOptions.user_id = new mongoose.Types.ObjectId(user_id.toString());
    }

    let selectOptions: string;
    if (fields && typeof fields === 'string') {
      selectOptions = fields.split(',').join(' ');
    } else {
      selectOptions = '-__v';
    }

    let sortOptions: any = {};

    if(sort && typeof sort === 'string') {
      const sortFields = sort.split(',');

      for (const field of sortFields) {
        const sortOrder = field.startsWith('-') ? -1 : 1;
        const sortName = field.replace(/^-/,'');

        sortOptions[sortName] = sortOrder;
      }
    } else {
      sortOptions = { createdAt: -1 };
    }

    const data = this.billModel.find(searchOptions)
                                .sort(sortOptions)
                                .select(selectOptions)
                                .populate('user_id', '_id username')
                                .populate({
                                  path: 'details',
                                  select: 'quantity discount',
                                  populate: {
                                    path: 'product_id',
                                    select: 'title price',
                                  },
                                });
    return data;
  }

  async findOne(id: string) : Promise<BillDocument> {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Please enter correct id');
    }

    const data = await this.billModel.findById(id)
                                      .populate('user_id', '_id username')
                                      .populate({
                                        path: 'details',
                                        select: 'quantity discount',
                                        populate: {
                                          path: 'product_id',
                                          select: 'title price',
                                        },
                                      });

    if(!data) {
      throw new NotFoundException('Product not found');
    }

    return data;
  }

  async update(id: string, updateBillDto: UpdateBillDto) {
    if (mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Please enter correct id');
    }


    const data = await this.billModel.findByIdAndUpdate(id, updateBillDto, {
      new: true,
      runValidators: true,
    });

    if(!data) {
      throw new NotFoundException('Product not found');
    }

    return data;
  }

  async remove(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Please enter correct ID!');
    }
    
    const returnData = await this.billDetailService.removeByIdBill(id);
    await this.billModel.deleteOne({_id: id}).exec();
    return {
      "status": "OK",
      "message": returnData.message + 1,
    }
  }
}
