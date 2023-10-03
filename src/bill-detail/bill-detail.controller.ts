import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { BillDetailService } from './bill-detail.service';
import { CreateBillDetailDto } from './dto/create-bill-detail.dto';
import { UpdateBillDetailDto } from './dto/update-bill-detail.dto';
import { BillDetail } from './schemas/bill-detail.schema';
import { Query as QueryEpress} from 'express-serve-static-core';

@Controller('bill-detail')
export class BillDetailController {
  constructor(private readonly billDetailService: BillDetailService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createBillDetailDto: CreateBillDetailDto
    ) : Promise<BillDetail> {
    return this.billDetailService.create(createBillDetailDto);
  }

  @Get()
  async findAll(
    @Query() query : QueryEpress,
  ) : Promise<BillDetail[]> {
    return this.billDetailService.findAll(query);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string
    ) : Promise<BillDetail>{
    return this.billDetailService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBillDetailDto: UpdateBillDetailDto
    ) : Promise<BillDetail>{
    return this.billDetailService.update(id, updateBillDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.billDetailService.removeByIdBill(id);
  }
}
