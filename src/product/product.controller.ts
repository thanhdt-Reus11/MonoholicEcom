import { Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Req, Query, Controller, UseGuards, ForbiddenException, BadRequestException, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RequestWithAuth } from 'src/auth/auth.type';
import { Product, ProductDocument } from './schemas/product.shema';
import { SkipToken } from 'src/auth/skip-token.decorator';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AbilityGuard } from 'src/ability/ability.guard';
import { CheckAbility } from 'src/ability/ability.decorator';
import { AbilityFactory, Action } from 'src/ability/ability.factory';
import { ForbiddenError } from '@casl/ability';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { CacheRedisInterceptor } from 'src/redis/cache.interceptor';


@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly abilityFactory: AbilityFactory,
    ) {}

  @SkipToken()
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query : ExpressQuery,
  ) : Promise<ProductDocument[]> {
    return this.productService.findAll(query);
  }

  @Get('my-product')
  @HttpCode(HttpStatus.OK)
  async findAllByUser (
    @Query() query : ExpressQuery,
    @Req() req : RequestWithAuth
  ) : Promise <ProductDocument[]>{
    query.user_id = req.user._id;
    return this.productService.findAll(query);
  }

  @SkipToken()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id') id: string,
    ) : Promise<ProductDocument> {
    return this.productService.findOne(id);
  }

  @CheckAbility({action: Action.Create, subject: Product})
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createProductDto: CreateProductDto,
    @Req() req : RequestWithAuth
    ) : Promise<ProductDocument>{
    return this.productService.create(createProductDto, req.user);
  }

  @CheckAbility({action: Action.Update, subject: Product})
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Req() req : RequestWithAuth,
    @Body() updateProductDto: UpdateProductDto
    ) : Promise<Product> {
    
    // const data = await this.productService.findOne(id);

    // const product = this.productService.productDocToSchema(data);
    // const ability = this.abilityFactory.defineAbility(req.user);

    // try {
    //   ForbiddenError.from(ability).throwUnlessCan(Action.Update, Product);
    //   return this.productService.update(id, updateProductDto);
    // } catch (error) {
    //   if (error instanceof ForbiddenError) {
    //     throw new ForbiddenException(error.message);
    //   }
    //   throw new BadRequestException('Bad request');
    // }

    return this.productService.update(id, updateProductDto);
    
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
