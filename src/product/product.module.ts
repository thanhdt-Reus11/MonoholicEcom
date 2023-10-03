import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.shema';
import { AbilityModule } from 'src/ability/ability.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [
    AbilityModule,
    RedisModule,
    MongooseModule.forFeature([{name:Product.name, schema:ProductSchema}]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
