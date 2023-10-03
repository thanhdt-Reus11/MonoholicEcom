import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Req, Query } from '@nestjs/common';
import { BillService } from './bill.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { RequestWithAuth } from 'src/auth/auth.type';
import { Bill, BillDocument } from './schemas/bill.schema';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Controller('bill')
export class BillController {
  constructor(private readonly billService: BillService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createBillDto: CreateBillDto,
    @Req() req:RequestWithAuth
    ) {
    return this.billService.create(createBillDto, req.user);
  }

  @Get('my-bill')
  @HttpCode(HttpStatus.OK)
  async findAllOfUser(
    @Query() query : ExpressQuery,
    @Req() req : RequestWithAuth
  ) : Promise<BillDocument[]> {
    query.user_id = req.user._id;
    return this.billService.findAll(query);
  }


  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: ExpressQuery
  ) : Promise<BillDocument[]>{
    return this.billService.findAll(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id') id: string,
    ) : Promise<BillDocument> {
    return this.billService.findOne(id);
  }


  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBillDto: UpdateBillDto
    ) : Promise<Bill> {
    return this.billService.update(id, updateBillDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.billService.remove(id);
  }
}
