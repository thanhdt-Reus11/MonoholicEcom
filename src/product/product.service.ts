import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schemas/product.shema';
import mongoose, { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/schemas/user.schema';
import { Query } from 'express-serve-static-core';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel : Model<ProductDocument>,
  ) {}

  async create(createProductDto: CreateProductDto, user : UserDocument) : Promise<ProductDocument>{
    const data = Object.assign(createProductDto, {user_id: user._id});
    const product = await this.productModel.create(data);
    return product;
  }

  async findAll(query: Query): Promise<ProductDocument[]> {
    const {title, summary, body, user_id, status, sort, fields} = query;
    let searchOptions: any = {};

    if (title) {
      searchOptions.title = {
        $regex: title,
        $options: 'i'
      };
    }

    if (summary) {
      searchOptions.summary = {
        $regex: summary,
        $options: 'i'
      };
    }

    if (body) {
      searchOptions.body = {
        $regex: body,
        $options: 'i'
      };
    }

    if (user_id) {
      searchOptions.user_id = new mongoose.Types.ObjectId(user_id.toString());
    }

    if (status) {
      searchOptions.status = parseInt(status.toString());
    }

    let selectOptions: string;

    if (fields && typeof fields === 'string') {
      selectOptions = fields.toString().split(',').join(' ');
    } else {
      selectOptions = '_id title summary body price status';
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

    const data = this.productModel.find(searchOptions)
                                  .sort(sortOptions)
                                  .select(selectOptions)
                                  .populate('user_id','_id username')
                                  .populate('product_categories_id', '_id title');

    return data;
  }


  async findOne(id: string) : Promise<ProductDocument> {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Please enter correct id');
    }

    const data = this.productModel.findById(id)
                                  .populate('user_id','_id username')
                                  .populate('product_categories_id', '_id title');

    if(!data) {
      throw new NotFoundException('Product not found!');
    }

    return data;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Please enter correct id');
    }

    const data = await this.productModel.findByIdAndUpdate(id, updateProductDto, {
      new: true,
      runValidators: true
    })

    if(!data) {
      throw new NotFoundException('Product not found');
    }

    return data;
  }

  async remove(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Please enter correct ID!');
    }
    
    const result = await this.productModel.deleteOne({id}).exec();
    return {
      "status": "OK",
      "message": `Delete successfully product with id: ${id}`,
    }
  }


  productDocToSchema(productDoc: ProductDocument): Product {
    const product = new Product();
    const forbidden = ['__v']; // Removes the __v and _id properties created by mongoose/mongodb
    for (const prop in productDoc) {
      if (!forbidden.includes(prop)) {
        product[prop] = productDoc[prop];
      }
    }
    console.log(product.user_id);
    return product;
  }
}
